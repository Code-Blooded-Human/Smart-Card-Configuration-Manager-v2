console.log("password.js file connected")
var passwordId = 1;
var passwordFileId = "";

var passwords = []
var passwordsNameIdDictionary = {}

class Password {
    constructor(name, maxLength, minLength, isAlphaNumeric, isNumericOnly, isSpecialChars) { // password type is an array of PasswordType
        this.identifier = passwordId;
        this.name = name;
        this.storedIn = passwordFileId;
        this.maxLength = maxLength;
        this.minLength = minLength;
        this.alphaNumeric = isAlphaNumeric
        this.numericOnly = isNumericOnly
        this.specialChars = isSpecialChars
        passwordId++;
    }
}

function onCreatePasswordBtnClick() {
    var passwordName = $("#passwordName").val();;
    var passwordMaxLength =$("#passwordMaxLength").val();
    var passwordMinLength = $("#passwordMinLength").val();
    var isAlphaNumeric = false;
    var isNumericOnly = false;
    var isSpecialChars = false;

    if(passwordName.length == 0) return false;

    $("input[type=checkbox]:checked").each(function(){
        if($(this).val() == "ALPHA_NUMERIC") isAlphaNumeric = true;
        if($(this).val() == "NUMERIC_ONLY") isNumericOnly = true;
        if($(this).val() == "SPECIAL_CHARS") isSpecialChars = true;
    });

    var newPassword = new Password(passwordName, passwordMaxLength, passwordMinLength, isAlphaNumeric, isNumericOnly, isSpecialChars);

    updatePasswordListDropBox(newPassword);
}

function updatePasswordListDropBox(newPassword){
    // appending to the password array
    passwords.push(newPassword);
    passwordsNameIdDictionary[newPassword.name] = newPassword.identifier;

    $('#passwordModalSubmitBtn').attr("data-dismiss","modal");  
    $( "#passwordList" ).append( "<div class='p-2 mb-3 passwordListItem' style='background-color:#d6d6c2;'>" + newPassword.name + "</div>" );
    $("#passwordForm ").trigger("reset");

    renderACRDropdrown();
}