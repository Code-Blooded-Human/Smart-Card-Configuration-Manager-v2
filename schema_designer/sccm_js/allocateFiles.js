var files = [0x3F00, 0x3F01, 0x3F02, 0x3F03]
var numFiles = files.length;

var filesAttributesArray = {"0x3F00": [], "0x3F01": [], "0x3F02": [], "0x3F03": []} // file name and associated atttributes index
var filesAccessModeArray = {"0x3F00": [], "0x3F01": [], "0x3F02": [], "0x3F03": []} // file name and access mode (in order of read, write and update) dictionary
var filesAttributesASN1Data = {};
const accessModeAndFileMap = new Map(); // access mode (tuple of readAccessMode, writeAccessMode, updateAccessMode) and file name map

function allocateFiles(){
    for (let i = 0; i < attributes.length; i++) {
        var readWriteUpdateACR = attributes[i].ACRReadWriteUpdate;
        var accessMode = readWriteUpdateACR.readACR + ", " + readWriteUpdateACR.writeACR + ", " + readWriteUpdateACR.updateACR;

        var fileId;
        if(accessModeAndFileMap.has(accessMode) == false){
            fileId = 0x3F00 + numFiles;
            files.push(fileId);
            numFiles++;
            accessModeAndFileMap.set(accessMode, fileId);
        }
        fileId = accessModeAndFileMap.get(accessMode);
        
        if(fileId in filesAttributesArray == false){
            filesAttributesArray[fileId] = new Array();
            filesAccessModeArray[fileId] = [readWriteUpdateACR.readACR, readWriteUpdateACR.writeACR, readWriteUpdateACR.updateACR];
        }
        filesAttributesArray[fileId].push(attributes[i]);
    }
}

// function onAllocateFilesBtnClick(){
//     allocateFiles();
//     generateASN1FormatOfAttributes();
// }

function generateASN1FormatOfAttributes(){
    for(let i = 4; i<files.length; i++){
        var fileId = files[i];
        filesAttributesASN1Data[fileId] = getASN1Format(filesAttributesArray[fileId]);
    }
    console.log(filesAttributesASN1Data)
}

function getASN1Format(attributesList){
    var attributesASN1= "AttributesInfo DEFINITIONS ::= BEGIN \n" + 
                        "Info ::= SEQUENCE {\n";

    for (let i = 0; i < attributesList.length; i++) {
        var attributeType = attributesList[i].dataType.type;
        switch(attributeType) {
            case "Integer":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " INTEGER";
                break;
            case "Float/Real":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " REAL";
                break;
            case "String":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " UTF8String";
                break;
            case "Image":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " OCTET STRING";
                break;
            case "Boolean":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " BOOLEAN";
                break;
            case "Date":
            case "Date-Time":
                attributesASN1 = attributesASN1 + "\t" + attributesList[i].name + " UTCTime";
            default:
        }
        if(i != attributesList.length - 1){
            attributesASN1 = attributesASN1 + ", \n";
        }
    }
    attributesASN1 = attributesASN1 + "\n}";
    attributesASN1 = attributesASN1.replace(/(\r\n|\n|\t|\r)/gm, "");
    return attributesASN1;
}
