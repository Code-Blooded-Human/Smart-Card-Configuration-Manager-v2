class SCF{
    constructor(scf){
        this.scf = scf;
    }


    getAttributeLocation(name)
    {
        var attr = this.scf.attributes;
        for(var i=0;i<attr.length;i++)
        {
            if(attr[i].name == name){
                return attr[i].filePath;
            }
        }
    }

    getFileMaxSize(filePath)
    {
        var fs = this.scf.fs;
        for(var i=0;i<fs.length;i++)
        {
            if(fs[i].path == filePath){
                return fs[i].size;
            }
        }
    }

    getFileSchema(filePath)
    {
        var fs = this.scf.fs;
        for(var i=0;i<fs.length;i++)
        {
            if(fs[i].path == filePath){
                return [fs[i].schema, fs[i].schemaName];
            }
        }
    }


}


module.exports = SCF;