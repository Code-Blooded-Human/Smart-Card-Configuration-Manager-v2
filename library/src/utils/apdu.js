function sendAPDU(reader,protocol,apdu,responseLength){
    return new Promise((resolve,reject)=>{
        reader.transmit(new Buffer(apdu), responseLength, protocol, function(err, data) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(data);
            }
        });
    });
}

function selectFile(reader,protocol,fileIdentifier)
{
    return new Promise((resolve,reject)=>{
        var apdu = [0x00, 0xA4, 0x00, 0x0C, 0x02,fileIdentifier[0],fileIdentifier[1],2];
        sendAPDU(reader,protocol,apdu,3)
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

function readSelectedFile(reader,protocol,responseLength)
{
    return new Promise((resolve, reject)=>{
        // TODO
    });
}

function readFile(reader, protocol, filePath, responseLength)
{
    return new Promise((resolve,reject)=>{
        // TODO
    });
}


