/* Auxilary function to replace character at an index in a string */
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

/* Auxilary function to convert a binary string to a hex string */
function binaryStrToHex(binaryStr){
    return parseInt(binaryStr, 2).toString(16);
}

/* Auxilary function to convert a hex string to bytes array */
function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }
    var a = [];
    var len = str.length;

    if(len%2){
        str = "0".concat(str);
    }
    
    for (var i = 0; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }
    return new Uint8Array(a);
}

/* Auxilary function to convert a bytes array to hex string */
/* As of now this function is not used */
function byteToHexString(uint8arr) {
    if (!uint8arr) {
      return '';
    }
    
    var hexStr = '';
    for (var i = 0; i < uint8arr.length; i++) {
      var hex = (uint8arr[i] & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }
    
    return hexStr.toUpperCase();
}

/* Auxilary function to append bytes array (of hex string) to another array */
function pushToValueArray(valueArray, value){
    var byteArray = hexStringToByte(value.toString(16));
    for(let i = 0; i < byteArray.length; i++){
        valueArray.push(byteArray[i]);
    }
}

/* Auxilary function to append TLV pair to an array */
function pushTLVPairToArray(FCPASN1Array, tag, valueArray){
    FCPASN1Array.push(tag);
    FCPASN1Array.push(valueArray.length);
    for(let i = 0; i < valueArray.length; i++){
        FCPASN1Array.push(valueArray[i]);
    }
}

/* 
    Auxilary function to get the next available shortEFId 
    @param:
        usedShortEFId: Array containing used short EF ID in order
*/
function getNextShortEFId(usedShortEFId){
    var EFId = hexStringToByte(binaryStrToHex((usedShortEFId.length+1).toString(2) + "000"));
    if(EFId.length > 1){
        console.log("Error, cannot create an EF with new short identifier");
        return -1;
    }
    usedShortEFId.push(EFId[0]);
    return EFId[0];
}


/* 
    Returns the coding of FDB as hex string
    @param:
        isSharable: true/false
        fileType: "DF"/"EF"
        EFCategory: "working", "internal"; (Applicable if fileType is EF)
        EFStructure: "transparent", "linearFixedSize", "linearFixedSizeTLV",
                 "linearVariableSize", "linearVariableSizeTLV", "CyclicFixedSize",
                 "CyclicFixedSizeTLV", "BER-TLV", "Simple-TLV"
*/
function getFileDescriptorByteCoding(isSharable, fileType, EFCategory, EFStructure){
    var FDBCoding = "00000000"; 
    if(isSharable){
        FDBCoding = FDBCoding.replaceAt(1, '1');
    }

    if(fileType == "DF"){
        FDBCoding = FDBCoding.replaceAt(2, '1');
        FDBCoding = FDBCoding.replaceAt(3, '1');
        FDBCoding = FDBCoding.replaceAt(4, '1');
        return binaryStrToHex(FDBCoding);
    }
    
    if(EFCategory == "internal"){
        FDBCoding = FDBCoding.replaceAt(4, '1');
    }

    switch(EFStructure) {
        case "transparent":
            FDBCoding = FDBCoding.replaceAt(7, '1');
            break;
        case "linearFixedSize":
            FDBCoding = FDBCoding.replaceAt(6, '1');
            break;
        case "linearFixedSizeTLV":
            FDBCoding = FDBCoding.replaceAt(7, '1');
            FDBCoding = FDBCoding.replaceAt(6, '1');
            break;
        case "linearVariableSize":
            FDBCoding = FDBCoding.replaceAt(5, '1');
            break;
        case "linearVariableSizeTLV":
            FDBCoding = FDBCoding.replaceAt(7, '1');
            FDBCoding = FDBCoding.replaceAt(5, '1');
            break;
        case "CyclicFixedSize":
            FDBCoding = FDBCoding.replaceAt(6, '1');
            FDBCoding = FDBCoding.replaceAt(5, '1');
            break;
        case "CyclicFixedSizeTLV":
            FDBCoding = FDBCoding.replaceAt(7, '1');
            FDBCoding = FDBCoding.replaceAt(6, '1');
            FDBCoding = FDBCoding.replaceAt(5, '1');
            break;
        default:
    }
    return binaryStrToHex(FDBCoding); 
}


/*
    Returns the Data Coding Byte as hex string
    @param:
        writeBehaviour: "oneTimeWrite", "proprietary", "writeOr", "writeAnd"
*/
function getDataCodingByte(writeBehaviour){
    var dataCodingByte = "00000000"; 
    switch(writeBehaviour) {
        case "oneTimeWrite":
            break;
        case "proprietary":
            dataCodingByte = dataCodingByte.replaceAt(2, '1');
            break;
        case "linearFixedSizeTLV":
            dataCodingByte = dataCodingByte.replaceAt(1, '1');
            FDBCoding = FDBCoding.replaceAt(6, '1');
            break;
        case "linearVariableSize":
            dataCodingByte = dataCodingByte.replaceAt(1, '1');
            dataCodingByte = dataCodingByte.replaceAt(2, '1');
            break;
        default:
    }
    dataCodingByte = dataCodingByte.replaceAt(7, '1'); // ask director sir why is this 1
    return binaryStrToHex(dataCodingByte);
}

/*
    Returns the FCP of the DF File as an array
    @param:
        fileInfo: Complex object containing info related to file like fileID
*/
function generateDFFCP(fileInfo){

    var FCPTLVFormat = [];
    var FCPCommandDataField = [];

    // FDB coding
    var FDBCodingValue = [];
    pushToValueArray(FDBCodingValue, getFileDescriptorByteCoding(false, fileInfo["fileType"]));
    pushTLVPairToArray(FCPCommandDataField, Tags.FileDesciptorByteDataCodingByte, FDBCodingValue);

    // File Identifier Coding
    var FileIdentifierValue = [];
    pushToValueArray(FileIdentifierValue, fileInfo["fileId"]);
    pushTLVPairToArray(FCPCommandDataField, Tags.FileIdentifier, FileIdentifierValue);

    // Life Cycle Coding
    var LifeCycleValue = [];
    pushToValueArray(LifeCycleValue, cardStatesValue.CreationState);
    pushTLVPairToArray(FCPCommandDataField, Tags.LifeCycleStaus, LifeCycleValue);

    // Security attribute template coding
    var SecurityAttributeTemplateValue = [];

    // Access Mode field coding
    var AccessModeFieldValue = [];
    pushToValueArray(AccessModeFieldValue, 0x7f);
    pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.AccessModeFieldExpanded, AccessModeFieldValue)

    // Security condition DO coding
    var SecurityConditionDODeleteValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["delete"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDODeleteValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["delete"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDODeleteValue);
    }

    var SecurityConditionDOTerminateValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["terminate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOTerminateValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["terminate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOTerminateValue);
    }

    var SecurityConditionDOActivateValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["activate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOActivateValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["activate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOActivateValue);
    }

    var SecurityConditionDODeactivateValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["deactivate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDODeactivateValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["deactivate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDODeactivateValue);
    }

    var SecurityConditionDOCreateDFValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["createDF"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOCreateDFValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["createDF"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOCreateDFValue);
    }

    var SecurityConditionDOCreateEFValue = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["createEF"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOCreateEFValue);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["createEF"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOCreateEFValue);
    }

    var SecurityConditionDODeleteChild = [];
    if(fileInfo["DFFileInfo"]["accessRules"]["deleteChild"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDODeleteChild);
    }
    else if(fileInfo["DFFileInfo"]["accessRules"]["deleteChild"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDODeleteChild);
    }

    pushTLVPairToArray(FCPCommandDataField, Tags.SecurityAttributeTemplateExpanded, SecurityAttributeTemplateValue);

    pushTLVPairToArray(FCPTLVFormat, 0x62, FCPCommandDataField);

    viewFCPFile(FCPTLVFormat);
    return FCPTLVFormat;

}

/*
    Returns the FCP of the EF File as an array
    @param:
        fileInfo: Complex object containing info related to file like fileID
*/
function generateEFFCP(fileInfo){

    var FCPTLVFormat = [];
    var FCPCommandDataField = [];

    fileInfo["EFFileInfo"]["shortEFId"] = getNextShortEFId(usedShortEFId);

    if(fileInfo["EFFileInfo"]["EFFileDataType"] == "binary"){
        // FileSize Coding
        var FileSizeCodingValue = [];
        
        if(hexStringToByte(fileInfo["EFFileInfo"]["fileMaxSize"].toString(16)).length < 2){
            pushToValueArray(FileSizeCodingValue, 0);
        }
        pushToValueArray(FileSizeCodingValue, fileInfo["EFFileInfo"]["fileMaxSize"]);
        pushTLVPairToArray(FCPCommandDataField, Tags.FileSizeExcludingStructuralInfo, FileSizeCodingValue);
    }

    // FDB coding
    var FDBCodingValue = [];
    pushToValueArray(FDBCodingValue, getFileDescriptorByteCoding(false, fileInfo["fileType"], fileInfo["EFFileInfo"]["EFCategory"], 
                                                                fileInfo["EFFileInfo"]["EFStructure"]));
    pushToValueArray(FDBCodingValue, getDataCodingByte(fileInfo["EFFileInfo"]["writeBehaviour"]));

    if (fileInfo["EFFileInfo"]["EFFileDataType"] == "record") {
        if(hexStringToByte(fileInfo["EFFileInfo"]["maxRecordSize"].toString(16)).length < 2){
            pushToValueArray(FDBCodingValue, 0);
        }
        pushToValueArray(FDBCodingValue, fileInfo["EFFileInfo"]["maxRecordSize"]);
        pushToValueArray(FDBCodingValue, fileInfo["EFFileInfo"]["numRecords"]);
    }
    pushTLVPairToArray(FCPCommandDataField, Tags.FileDesciptorByteDataCodingByte, FDBCodingValue);

    // File Identifier Coding
    var FileIdentifierValue = [];
    pushToValueArray(FileIdentifierValue, fileInfo["fileId"]);
    pushTLVPairToArray(FCPCommandDataField, Tags.FileIdentifier, FileIdentifierValue);

    // Short Identifier Coding
    var ShortIdentifierValue = [];
    pushToValueArray(ShortIdentifierValue, fileInfo["EFFileInfo"]["shortEFId"]);
    pushTLVPairToArray(FCPCommandDataField, Tags.ShortEFIdentifier, ShortIdentifierValue);

    // Life Cycle Coding
    var LifeCycleValue = [];
    pushToValueArray(LifeCycleValue, cardStatesValue.CreationState);
    pushTLVPairToArray(FCPCommandDataField, Tags.LifeCycleStaus, LifeCycleValue);

    // Security attribute template coding
    var SecurityAttributeTemplateValue = [];

    // Access Mode field coding
    var AccessModeFieldValue = [];
    pushToValueArray(AccessModeFieldValue, 0x7f);
    pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.AccessModeFieldExpanded, AccessModeFieldValue)

    // Security condition DO coding
    var SecurityConditionDODeleteValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["delete"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDODeleteValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["delete"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDODeleteValue);
    }
    
    var SecurityConditionDOTerminateValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["terminate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOTerminateValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["terminate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOTerminateValue);
    }
    

    var SecurityConditionDOActivateValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["activate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOActivateValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["activate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOActivateValue);
    }

    var SecurityConditionDODeactivateValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["deactivate"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDODeactivateValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["deactivate"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDODeactivateValue);
    }

    var SecurityConditionDOWriteValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["write"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOWriteValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["write"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOWriteValue);
    }
    else{
        var passwordId = getPasswordId(fileInfo["EFFileInfo"]["accessRules"]["write"]);
        var SecurityConditionDOWriteValue = getExternalAuthPasswordBasedCRT(passwordId);
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOExternalAuthExpanded, SecurityConditionDOWriteValue);
    }

    var SecurityConditionDOUpdateValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["update"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOUpdateValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["update"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOUpdateValue);
    }
    else{
        var passwordId = getPasswordId(fileInfo["EFFileInfo"]["accessRules"]["update"]);
        var SecurityConditionDOUpdateValue = getExternalAuthPasswordBasedCRT(passwordId);
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOExternalAuthExpanded, SecurityConditionDOUpdateValue);
    }

    var SecurityConditionDOReadValue = [];
    if(fileInfo["EFFileInfo"]["accessRules"]["read"] == "Always"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOAlwaysExpanded, SecurityConditionDOReadValue);
    }
    else if(fileInfo["EFFileInfo"]["accessRules"]["read"] == "Never"){
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDONeverExpanded, SecurityConditionDOReadValue);
    }
    else{
        var passwordId = getPasswordId(fileInfo["EFFileInfo"]["accessRules"]["read"]);
        var SecurityConditionDOReadValue = getExternalAuthPasswordBasedCRT(passwordId);
        pushTLVPairToArray(SecurityAttributeTemplateValue, Tags.SecurityConditionDOExternalAuthExpanded, SecurityConditionDOReadValue);
    }

    pushTLVPairToArray(FCPCommandDataField, Tags.SecurityAttributeTemplateExpanded, SecurityAttributeTemplateValue);

    pushTLVPairToArray(FCPTLVFormat, 0x62, FCPCommandDataField);

    viewFCPFile(FCPTLVFormat);
    return FCPTLVFormat;
}

/*
    Auxilary function to create the complex object fileInfo 
*/
function getFileInfo(fileId, fileType, otherInfo){
    var fileInfo = {"fileId": fileId, "fileType": fileType};
    if(fileType == "EF"){
        fileInfo["EFFileInfo"] = otherInfo;
    }
    else{
        fileInfo["DFFileInfo"] =  otherInfo;
    }
    var path = [0x3f00];
    if(fileId != 0x3f00){
        path.push(fileId);
    }
    fileInfo["path"] = path;
    return fileInfo;
}

function viewFCPFile(FCPASN1){
    var temp = "";
    for(let i = 0; i < FCPASN1.length; i++){
        var str = FCPASN1[i].toString(16);
        if(str.length%2){
            str = "0".concat(str);
        }
        // console.log("index:", i, " ", str)
        temp = temp + "0x" + str;
        if(i != FCPASN1.length - 1){
            temp = temp + ", ";
        }
    }
    console.log(temp);
}

function getPasswordId(ACRName){
    var ACRId = ACRsNameIdDictionary[ACRName];
    var ACRObject = ACRs[ACRId-1];
    var passwordId = passwordsNameIdDictionary[ACRObject.rule.leftCondition];
    return passwordId;
}

function getExternalAuthPasswordBasedCRT(passwordReferenceId){
    var externalAuthPasswordBasedCRTValue = [];
    var cryptogramDesciptorByte = parseInt(64) + parseInt(passwordReferenceId);
    var usageQualifierByteCoding = [];
    var cryptogramContentReferenceCoding  = [];

    pushTLVPairToArray(usageQualifierByteCoding, Tags.UsageQualifierByte, [0x88]);
    pushTLVPairToArray(cryptogramContentReferenceCoding, Tags.CryptogramContentReference, [cryptogramDesciptorByte]);

    for(let i = 0; i < usageQualifierByteCoding.length; i++){
        pushToValueArray(externalAuthPasswordBasedCRTValue, usageQualifierByteCoding[i])
    }
    for(let i = 0; i < cryptogramContentReferenceCoding.length; i++){
        pushToValueArray(externalAuthPasswordBasedCRTValue, cryptogramContentReferenceCoding[i])
    }
    return externalAuthPasswordBasedCRTValue;
}

/*
As of now, with always access rule (for actions on EF/DF) and string type attribute (to be saved in files), I'm able to generate SCCM file.
ToDO Tomorrow: 
    1. Add password based access control to files 
    2. add acess rules in the fileStructure in the SCCM file       ---------------- Done
    3. convert TLV array to TLV dictionary for readibility
    4. add asn1 for attributes in each file created              --------------- Done
    5. Remove this assumption, ```Assumption```: Assuming attributes are string as of now, will do it correctly for others too
    6. Convert SCCM file from json to hjson
*/