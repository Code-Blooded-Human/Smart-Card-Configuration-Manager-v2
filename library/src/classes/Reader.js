const Card = require("./Card");

class Reader{
    constructor(){
        this.scReader = undefined;
        this.scProtocol = undefined;
        this.cardConnectedEvent = (card)=>{console.log("Card Connected handler not defined")};
    }

    OnCardConnectedEvent(event){
        this.cardConnectedEvent = event;
    }

    cardConnected()
    {
        var card = new Card(this.scReader,this.scProtocol, this.scf);
        this.cardConnectedEvent(card);
    }

    registerReader(reader,protocol)
    {
        this.scReader=reader;
        this.scProtocol=protocol;
    }

    registerSCF(scf){
        this.scf = scf;
    }

}

module.exports = Reader;