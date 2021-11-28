class SCCMFile{
    constructor(header, securityEnvironments){
        this.header = header;
        this.keys = keys;
        this.passwords = passwords;
        this.securityEnvironments = securityEnvironments;
        this.accessRules = ACRs;
        this.attributes = attributes;
        this.fs = fileStructureInfo;
    }
}

class header{
    constructor(description, policymaker, version, hash, createdFrom, isBackwardCompatible){
        this.description = description;
        this.policymaker = policymaker;
        this.version = version;
        this.hash = hash;
        this.createdFrom = createdFrom;
        this.backwardCompatible = isBackwardCompatible;
        this.createdOn = dateTime;
    }
}

class policymaker{
    constructor(name, email){
        this.name = name;
        this.email = email;
    }
}

function onGenerateSCFBtnClick(){
    console.log("Generate SCF button Clicked");

    allocateFiles();
    generateASN1FormatOfAttributes();

    var sccmPolicymaker = new policymaker("Kumari Rani", "krani@iitbhilai.ac.in");
    var sccmHeader = new header("This is a sample SCCM Configuration File", sccmPolicymaker, "1.0", "", "", true);

    generateFCP();

    var sccmFileJSON = JSON.stringify(new SCCMFile(sccmHeader, ""), null, 4);
    downloadSCCMsonFile(sccmFileJSON, "SCFFile.json");
}

function downloadSCCMsonFile(jsonContent, fileName){
    //Convert JSON string to BLOB.
    var file = new Blob([jsonContent], { type: "text/plain;charset=utf-8" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}