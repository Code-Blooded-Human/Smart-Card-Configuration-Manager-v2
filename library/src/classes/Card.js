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
    
    readSelectedFile(responseLength)
    {
        return new Promise((resolve, reject)=>{
            var apdu = [0x00, 0xB0, 0x00, 0x00, responseLength];
            this.sendAPDU(apdu,responseLength+100)
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
    
    readFile(filePath, responseLength)
    {
        return new Promise((resolve,reject)=>{
            // TODO
        });
    }
}

module.exports = Card;