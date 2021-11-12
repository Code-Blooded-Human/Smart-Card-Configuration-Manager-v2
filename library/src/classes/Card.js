const lengthEncodingAsByteArray = require("../utils/utils");

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
class Card{
    constructor(reader,protocol)
    {
        this.reader = reader;
        this.protocol = protocol;
    }

    sendAPDU(apdu,responseLength){
        return new Promise((resolve,reject)=>{
            this.reader.transmit(new Buffer(apdu), responseLength, this.protocol, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    selectFile(fileIdentifier)
    {
        return new Promise((resolve,reject)=>{
            var apdu = [0x00, 0xA4, 0x00, 0x0C, 0x02,fileIdentifier[0],fileIdentifier[1],2];
            this.sendAPDU(apdu,3)
            .then((data)=>{
                //check if success
                console.log(data);
                resolve();
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            })
        });
    }

    readBinaryRecursively(offset,toRead,resolve,buf){
        var apduOffeset = 0x0000 | offset;
        var b1 = (apduOffeset & 0xFF00)/256;
        var b2 = (apduOffeset & 0x00FF);
        var apdu = [0x00,0xB0,b1,b2,0xFF]
        offset=offset+255;
        this.sendAPDU(apdu,300)
        .then((data)=>{
            //check if success
            console.log(new Buffer(apdu))
            console.log(data);
            buf.push(data);
            if(offset < toRead){
                this.readBinaryRecursively(offset,toRead,resolve,buf);
            }else{
                var x = Buffer.concat(buf);
                resolve(x);
            }
            
        })
    }
    
    readSelectedFile(responseLength)
    {
        return new Promise((resolve, reject)=>{
            // var apdu = [0x00, 0xB0, 0x00, 0x00];
            // var le = lengthEncodingAsByteArray(responseLength);
            // apdu = apdu.concat(le);
            var apdu = [0x00, 0xB0, 0x80, 0x02, 0xFF]
            console.log(new Buffer(apdu));
            this.sendAPDU(apdu,3000)
            .then((data)=>{
                //check if success
                console.log(data);
                resolve(data);
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            })
        });
    }
    readSelectedFileExtended(responseLength)
    {
        return new Promise((resolve, reject)=>{
            var buf = [];
            this.readBinaryRecursively(0,responseLength,resolve,buf);
        });
    }

 
    readFileRecursively(filePath,responseLength,resolve){
        if(filePath.length == 1){
            this.selectFile(hexToBytes(filePath[0]))
            .then(()=>{
                return this.readSelectedFileExtended(responseLength)
            })
            .then((data)=>{
                resolve(data);
            })
        }else{
            this.selectFile(hexToBytes(filePath[0]))
            .then(()=>{
                filePath.shift();
                this.readFileRecursively(filePath,responseLength,resolve);
            })
        }
    }
    
    readFileByPath(filePath, responseLength)
    {
        return new Promise((resolve,reject)=>{
            this.readFileRecursively(filePath,responseLength,resolve);
        });
    }
}

module.exports = Card;