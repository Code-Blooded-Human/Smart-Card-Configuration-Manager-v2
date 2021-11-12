function lengthEncodingAsByteArray(length)
{
    // if(length <= 0x7F){
    //     return [length]
    // }
    
    // if(length <= 0xFF){
    //     return [0x81,length];
    // }
    // if(length <= 0xFFFF){
    //     return [0x82, (length & 0xFF00)/256, length & 0x00FF]
    // }

    if(length <= 0xFF){
        return [0xFF];
    }

    
    if(length <= 0xFFFF){
        return [0x00, (length & 0xFF00)/256, length & 0x00FF]
    }

    return [0x00,0x00,0x00];
}

module.exports = lengthEncodingAsByteArray;