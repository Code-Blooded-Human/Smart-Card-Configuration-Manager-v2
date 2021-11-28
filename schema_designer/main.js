console.log("main.js connected");
setDropdownBtnValue();


var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

$(".dropdown-menu .dropdown-item").click(function(){
    $(this).parents(".dropdown").find('.btn').text($(this).text());
    $(this).parents(".dropdown").find('.btn').val($(this).text());
});

function setDropdownBtnValue(){
    var dropdownItem = $(".dropdown");
    for (let i = 0; i < dropdownItem.length; i++) {
        var dropdownItemValue = $($(dropdownItem[i]).find('.dropdown-menu .dropdown-item')[0]).text();
        $(dropdownItem[i]).find('.btn').text(dropdownItemValue);
        $(dropdownItem[i]).find('.btn').val(dropdownItemValue);
    }
}

function renderACRDropdrownHelper(dropdownACRID){

    $(dropdownACRID).empty();

    $( dropdownACRID ).append( "<h6 class='dropdown-header'>Primitive</h6>" );
    $( dropdownACRID ).append( "<a class='dropdown-item' href='#!'>Always</a>" );
    $( dropdownACRID ).append( "<a class='dropdown-item' href='#!'>Never</a>" );

    for (let i = 0; i < passwords.length; i++) {
        if(i == 0){
            $( dropdownACRID ).append( "<h6 class='dropdown-header'>Passwords</h6>" );
        }
        $( dropdownACRID ).append( "<a class='dropdown-item' href='#!'>" + passwords[i].name + "</a>" );
    }
    for (let i = 0; i < keys.length; i++) {
        if(i == 0){
            $( dropdownACRID ).append( "<h6 class='dropdown-header'>Keys</h6>" );
        }
        $( dropdownACRID ).append( "<a class='dropdown-item' href='#!'>" + keys[i].name + "</a>" );
    }
    for (let i = 0; i < ACRs.length; i++) {
        if(i == 0){
            $( dropdownACRID ).append( "<h6 class='dropdown-header'>ACRs</h6>" );
        }
        $( dropdownACRID ).append( "<a class='dropdown-item' href='#!'>" + ACRs[i].name + "</a>" );
    }
    $(".dropdown-menu .dropdown-item").click(function(){
        $(this).parents(".dropdown").find('.btn').text($(this).text());
        $(this).parents(".dropdown").find('.btn').val($(this).text());
    });
}

function renderACRDropdrown(){
    renderACRDropdrownHelper("#ACRConditionRightOptions");
    renderACRDropdrownHelper("#ACRConditionLeftOptions");
}

function renderAttributesACR(){
    $(".acr-read-write-update").empty();

    $( ".acr-read-write-update" ).append( "<h6 class='dropdown-header'>Primitive</h6>" );
    $( ".acr-read-write-update" ).append( "<a class='dropdown-item' href='#!'>Always</a>" );
    $( ".acr-read-write-update" ).append( "<a class='dropdown-item' href='#!'>Never</a>" );

    for (let i = 0; i < ACRs.length; i++) {
        if(i == 0){
            $( ".acr-read-write-update" ).append( "<h6 class='dropdown-header'>ACRs</h6>" );
        }
        $( ".acr-read-write-update" ).append( "<a class='dropdown-item' href='#!'>" + ACRs[i].name + "</a>" );
    }
    $(".dropdown-menu .dropdown-item").click(function(){
        $(this).parents(".dropdown").find('.btn').text($(this).text());
        $(this).parents(".dropdown").find('.btn').val($(this).text());
    });
}