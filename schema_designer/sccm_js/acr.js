console.log("acr.js file connected")
var ACRId = 1;

var ACRs = []
var ACRsNameIdDictionary = {}

class ACR {
    constructor(name, rule) {
        this.id = ACRId;
        this.name = name;
        this.rule = rule;
        this.implentation = "SE-Identifirer";
        ACRId++;
    }
}

class ACRRule {
    constructor(leftCondition, operator, rightCondition){
        this.leftCondition = leftCondition;
        this.operator = operator;
        this.rightCondition = rightCondition;
    }
}

function onCreateACRBtnClick() {
    var ACRName = $("#ACRName").val();
    var leftCondition = $('#ACRConditionLeftDropdown').find('.btn').val();
    var operator = $('#ACROperatorDropdown').find('.btn').val();
    var rightCondition = $('#ACRConditionRightDropdown').find('.btn').val();

    if(ACRName.length == 0) return false;

    var newACRRule = new ACRRule(leftCondition, operator, rightCondition);
    var newACR = new ACR(ACRName, newACRRule);
    
    updateACRListDropBox(newACR);
}

function updateACRListDropBox(newACR){
    // appending to the password array
    ACRs.push(newACR);
    ACRsNameIdDictionary[newACR.name] = newACR.id;

    $('#ACRModalSubmitBtn').attr("data-dismiss","modal");  
    $( "#ACRList" ).append( "<div class='p-2 mb-3 passwordListItem' style='background-color:#d6d6c2;'>" + newACR.name + "</div>" );
    $("#ACRForm").trigger("reset");

    renderACRDropdrown();
    renderAttributesACR();
    setDropdownBtnValue();
}