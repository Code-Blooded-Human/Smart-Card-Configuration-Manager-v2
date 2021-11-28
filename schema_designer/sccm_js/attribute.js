console.log("attribute.js file connected")
var attributeId = 1;

var attributes = []

class Attribute {
    constructor(name, dataType, ACRReadWriteUpdate, storedIn) { 
        this.id = attributeId;
        this.name = name;
        this.dataType = dataType;
        this.ACRReadWriteUpdate = ACRReadWriteUpdate;
        this.storedIn = storedIn;
        attributeId++;
    }
}

class AccessRulesReadWriteUpdate{
    constructor(readACR, writeACR, updateACR){
        this.readACR = readACR;
        this.writeACR = writeACR;
        this.updateACR = updateACR;
    }
}

function onCreateAttributeBtnClick() {
    var attributeName = $("#attributeName").val();
    if(attributeName.length == 0) return false;

    var type = $('#attributeTypeDropdown').find('.btn').val();
    // const car = {type:"Fiat", model:"500", color:"white"};

    var readACR = $('#readACRDropdown').find('.btn').val();
    var writeACR = $('#writeACRDropdown').find('.btn').val();
    var updateACR = $('#updateACRDropdown').find('.btn').val();

    var ACRReadWriteUpdate = new AccessRulesReadWriteUpdate(readACR, writeACR, updateACR);
    
    var dataType = {"type": type};

    switch(type) {
        case "Integer":
        case "Float/Real":
            var minValue = $("#attributeMinValue").val(); 
            var maxValue = $("#attributeMaxValue").val();
            dataType["minValue"] = minValue;
            dataType["maxValue"] = maxValue;
            break;
        case "String":
            var maxLength = $("#attributeMaxLength").val();
            dataType["maxLength"] = maxLength;
            break;
        case "Image":
            var maxSizeInBytes = $("#attributeMaxSizeInBytes").val();
            dataType["maxSizeInBytes"] = maxSizeInBytes;
            break;
        default:
    }

    var newAttribute = new Attribute(attributeName, dataType, ACRReadWriteUpdate, "");
    updateAttributeListDropBox(newAttribute);
}

function updateAttributeListDropBox(newAttribute){
    // appending to the attributes array
    attributes.push(newAttribute);
    $('#attributeModalSubmitBtn').attr("data-dismiss","modal");  
    $( "#attributeList" ).append( "<div class='p-2 mb-3 attributeListItem' style='background-color:#d6d6c2;'>" + newAttribute.name + "</div>" );
    $("#attributeForm ").trigger("reset");
    setDropdownBtnValue();
}


$("#attributeDataTypeDropdownMenu").click(function(){
    $(".optionalAttributesField").empty();
    var type = $('#attributeTypeDropdown').find('.btn').val();

    switch(type) {
        case "Integer":
        case "Float/Real":
            $(".optionalAttributesField").append( "<div class='form-group row'>" + 
                                                "<label for='attributeMinValue' class='col-sm-2 col-form-label'>Min Value</label>" + 
                                                "<div class='col-sm-10'>" + 
                                                "<input type='number' class='form-control' id='attributeMinValue' placeholder='Ex: 30'></div></div>" );
            $(".optionalAttributesField").append( "<div class='form-group row'>" + 
                                                "<label for='attributeMaxValue' class='col-sm-2 col-form-label'>Max Value</label>" + 
                                                "<div class='col-sm-10'>" + 
                                                "<input type='number' class='form-control' id='attributeMaxValue' placeholder='Ex: 30'></div></div>" );
            break;
        case "String":
            $(".optionalAttributesField").append( "<div class='form-group row'>" + 
                                                "<label for='attributeMaxLength' class='col-sm-2 col-form-label'>Max Length</label>" + 
                                                "<div class='col-sm-10'>" + 
                                                "<input type='number' class='form-control' id='attributeMaxLength' placeholder='Ex: 30'></div></div>" );
            break;
        case "Image":
            $(".optionalAttributesField").append( "<div class='form-group row'>" + 
                                                "<label for='attributeMaxSizeInBytes' class='col-sm-2 col-form-label'>Max Size in Bytes</label>" + 
                                                "<div class='col-sm-10'>" + 
                                                "<input type='number' class='form-control' id='attributeMaxSizeInBytes' placeholder='Ex: 30'></div></div>" );
            break;
        default:
    }

});

// <div class='form-group row'><label for='attributeMaxLength' class='col-sm-2 col-form-label'>Max Length</label><div class='col-sm-10'><input type='number'  class='form-control' id='attributeMaxLength' placeholder='Ex: 30'></div></div>