console.log("generateFCP.js connected");

var usedShortEFId = [];
var fileStructureInfo = [];
var DFName = new Map();
DFName.set(0x3f00, "MasterFile");

Tags = {
    "FileSizeIncludingStructuralInfo"           : 0x81,
    "FileSizeExcludingStructuralInfo"           : 0x80,
    "FileDesciptorByteDataCodingByte"           : 0x82,
    "FileIdentifier"                            : 0x83,
    "DFName"                                    : 0x84,
    "ShortEFIdentifier"                         : 0x88,
    "LifeCycleStaus"                            : 0x8A,
    "SecurityAttributeTemplateExpanded"         : 0xAB,
    "AccessModeFieldExpanded"                   : 0x80,
    "SecurityConditionDOAlwaysExpanded"         : 0x90,
    "SecurityConditionDONeverExpanded"          : 0x97,
    "SecurityConditionDOExternalAuthExpanded"   : 0xA4,
    "UsageQualifierByte"                        : 0x95,
    "CryptogramContentReference"                : 0x8E
};

FixedTagLength = {
    0x83: 2,
    0x88: 1,
    0x8A: 1,
    0x95: 1,
    0x8E: 1
};

cardStatesValue = {
    "CreationState": 0x01,
    "InitializationState": 0x03,
    "DeactivatedState": 0x04,
    "ActivationState": 0x05,
    "TerminationState": 0x0c
};

function generateMasterFile(){
    var fileType = "DF";
    var fileId = 0x3f00;
    var DFFileInfo = {
        "DFName": DFName.get(fileId),
        "accessRules": {
            "delete": "Never",
            "terminate": "Never",
            "activate": "Always",
            "deactivate": "Never",
            "createDF": "Always",
            "createEF": "Always",
            "deleteChild": "Never"
        }
    }
    var fileInfo = getFileInfo(fileId, fileType, DFFileInfo);
    fileInfo["FCPTLVCoding"] = generateDFFCP(fileInfo);
    fileStructureInfo.push(fileInfo);
}

function generatePINFile(){
    var numRecords = passwords.length;
    var maxPasswordLength = 0;
    var maxRecordSize;
    var fileType = "EF";
    var fileId = 0x3f01;

    for(let i = 0; i < passwords.length; i++){
        maxPasswordLength = Math.max(maxPasswordLength, passwords[i].maxLength);
    }
    // in bytes, added 4 (2 bytes extra for future use and 2 bytes as per SCOSTA doc (1 bytes identifier, 4 bits retry counter, 4 bits max retry count))
    maxRecordSize = maxPasswordLength + 4;

    var EFFileInfo = {
        "shortEFId": "",
        "EFCategory": "internal",
        "EFFileDataType": "record", 
        "maxRecordSize": maxRecordSize, 
        "numRecords": numRecords, 
        "writeBehaviour": "oneTimeWrite", 
        "EFStructure": "linearVariableSize",
        "accessRules": {
            "delete": "Never",
            "terminate": "Never",
            "activate": "Always",
            "deactivate": "Never",
            "write": "Always",
            "update": "Never",
            "read": "Never"
        }
    };

    var fileInfo = getFileInfo(fileId, fileType, EFFileInfo);
    fileInfo["FCPTLVCoding"] = generateEFFCP(fileInfo);
    fileStructureInfo.push(fileInfo);
}

function generatePersonalInfoFiles(){
    for(let i = 4; i < files.length; i++){
        generatePersonalInfoFile(files[i]);
    }
}

function generatePersonalInfoFile(fileId){
    console.log("access mode", filesAccessModeArray[fileId]);

    var fileSize = 0;
    var fileType = "EF";

    var readAM = filesAccessModeArray[fileId][0]; 
    var writeAM = filesAccessModeArray[fileId][1]; 
    var updateAM = filesAccessModeArray[fileId][2];

    /*
        ```Assumption```: Assuming attributes are string as of now, will do it correctly for others too 
    */
    for(let i = 0; i < filesAttributesArray[fileId].length; i++){
        fileSize = fileSize + parseInt(filesAttributesArray[fileId][i]["dataType"]["maxLength"]);
    }

    // add buffer size of 4 bytes
    fileSize = fileSize + 4;

    var EFFileInfo = {
        "shortEFId": "",
        "EFCategory": "working",
        "EFFileDataType": "binary",
        "fileMaxSize" : fileSize,
        "writeBehaviour": "oneTimeWrite", 
        "EFStructure": "transparent",
        "accessRules": {
            "delete": "Never",
            "terminate": "Never",
            "activate": "Always",
            "deactivate": "Never",
            "write": writeAM,
            "update": updateAM,
            "read": readAM
        }
    };

    var fileInfo = getFileInfo(fileId, fileType, EFFileInfo);
    fileInfo["attributesAS1DataFormat"] = filesAttributesASN1Data[fileId];
    fileInfo["FCPTLVCoding"] = generateEFFCP(fileInfo);
    fileStructureInfo.push(fileInfo);
}

function generateFCP(){
    generateMasterFile();
    generatePINFile();
    generatePersonalInfoFiles();
}

