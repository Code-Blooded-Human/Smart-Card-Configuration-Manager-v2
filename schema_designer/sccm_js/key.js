console.log("key.js file connected")
var keyId = 1;

var keys = []

class Key {
    constructor(name, algorithm) {
        this.id = keyId;
        this.name = name;
        this.algorithm = algorithm;
        keyId++;
    }
}

function onCreateKeyBtnClick() {
    var keyName = $("#keyName").val();
    var keyAlgorithm = $('#keyAlgorithmDropdown').find('.btn').val();
    
    if(keyName.length == 0) return false;
    var newKey = new Key(keyName, keyAlgorithm);
    updateKeyListDropBox(newKey);
}

function updateKeyListDropBox(newKey){
    // appending to the password array
    keys.push(newKey);

    $('#keyModalSubmitBtn').attr("data-dismiss","modal");  
    $( "#keyList" ).append( "<div class='p-2 mb-3 keyListItem' style='background-color:#d6d6c2;'>" + newKey.name + "</div>" );
    $("#keyForm ").trigger("reset");

    renderACRDropdrown();
    setDropdownBtnValue();
}