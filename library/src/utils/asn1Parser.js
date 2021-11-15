const fs = require('fs');
const { exec } = require("child_process");
const { resolve } = require('path');


function rawBytesToJson(byteArray,asn1Schema,attributename){
    return new Promise((resolve,reject)=>{
        fs.writeFile("/tmp/raw_input.hex", byteArray.toString('hex'), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Hex file was saved successfuly");
            fs.writeFile("/tmp/schema.asn", asn1Schema, function(err) {
                if(err) {
                    return console.log(err);
                }
                exec(`python3 ./src/asn1_python/decode.py /tmp/schema.asn /tmp/raw_input.hex /tmp/out.json ${attributename}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                    }
                    console.log(`stdout: ${stdout}`);
                    fs.readFile("/tmp/out.json", "utf8", (err, jsonString) => {
                        if (err) {
                        console.log("File read failed:", err);
                        return;
                        }
                        resolve(JSON.parse(jsonString))
                    });
                });
            });
        });
    });
}

module.exports = rawBytesToJson;