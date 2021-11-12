var pcsc = require('pcsclite');
var Reader = require('./classes/Reader');
const fs = require('fs');
const rawBytesToJson = require('./utils/asn1Parser');
const SCF = require('./classes/SCF');




var pcsc = pcsc();
var sc_reader = new Reader;


pcsc.on('reader', function(reader) {

    console.log('New reader detected', reader.name);

    reader.on('error', function(err) {
        console.log('Error(', this.name, '):', err.message);
    });

    reader.on('status', function(status) {
        console.log('Status(', this.name, '):', status);
        /* check what has changed */
        var changes = this.state ^ status.state;
        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                console.log("card removed");/* card removed */
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Disconnected');
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                console.log("card inserted");/* card inserted */
                reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Protocol(', reader.name, '):', protocol);
                        sc_reader.registerReader(reader,protocol);
                        sc_reader.cardConnected();
                    }
                });
            }
        }
    });

    reader.on('end', function() {
        console.log('Reader',  this.name, 'removed');
    });
});

var schema =`
BHILAIINFO1V2
DEFINITIONS IMPLICIT TAGS ::= BEGIN
Info1FreeReadV2 ::= SEQUENCE {

version INTEGER,
id PrintableString,
validupto PrintableString,
name UTF8String,
dob PrintableString,
uid PrintableString,
emergencyphone UTF8String,
bloodgroup PrintableString,
issuerauthority PrintableString,
gender PrintableString,
dateofissue PrintableString,
designation [0] UTF8String OPTIONAL,
program [1] UTF8String OPTIONAL,
relation [2] PrintableString OPTIONAL,
nameofprimary [3] UTF8String OPTIONAL,
designationofprimary [4] UTF8String OPTIONAL,
programofprimary [5] UTF8String OPTIONAL,
doj [6] PrintableString OPTIONAL,
dojofprimary [7] PrintableString OPTIONAL,
photo OCTET STRING

}
END
`
var scfjson={
    attributes:[{
        name:"name",
        filePath:["3F00","3F04"]
    }],
    fs:[
        {
            path:["3F00","3F04"],
            schema:schema,
            schemaName:"Info1FreeReadV2",
            size:6000
        }]
}
var scf = new SCF(scfjson);


function cardConnect(card)
{
    // card.selectFile([0x3F,0x00])
    // .then(()=>{return card.selectFile([0x3F,0x04])})
    // .then(()=>{return card.readSelectedFileExtended(6000)})
    // .then((data)=>{return rawBytesToJson(data,schema,'Info1FreeReadV2')})
    // .then((data)=>{console.log(data)})


    // card.readFileByPath(["3F00","3F04"],6000)
    // .then((data)=>{console.log(data)})

    card.readAttribute("name")
        .then((data)=>{console.log(data)});
}
sc_reader.registerSCF(scf);
sc_reader.OnCardConnectedEvent(cardConnect);

// modele.exports = sc_reader;