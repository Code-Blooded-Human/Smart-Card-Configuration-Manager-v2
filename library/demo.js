var reader = require('./src/index.js');
var SCF = require('./src/classes/SCF');
const fs = require('fs');

// Read & Register the SCCM Configuration File
fs.readFile("./sample_scf/basic_scf.json", "utf8", (err, jsonString) => {
    if (err) {
    console.log("File read failed:", err);
    return;
    }
    var scf_json  = JSON.parse(jsonString);
    var scf = new SCF(scf_json);
    reader.registerSCF(scf); // load the configuration file to be used.
});

// Define handler for card connect event
function cardConnectHandler(card){
    card.readAttribute("photo")
        .then((value)=>{console.log(value)});
}

reader.OnCardConnectedEvent(cardConnectHandler);
