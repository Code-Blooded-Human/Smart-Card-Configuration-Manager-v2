class SCF{
    constructor(scf){
        this.scf = scf;
    }


    getAttributeFile(name)
    {
        var attr = this.scf.attributes;
        for(var i=0;i<attr.length;i++)
        {
            if(attr[i].name == name){
                return attr[i].fileID;
            }
        }
    }

    getFileMaxSize(file)
    {
        var fs = this.scf.fs;
        for(var i=0;i<fs.length;i++)
        {
            if(fs[i].id == file){
                return fs[i].size;
            }
        }
    }

    getFileSchema(file)
    {
        var fs = this.scf.fs;
        for(var i=0;i<fs.length;i++)
        {
            if(fs[i].id == file){
                return [fs[i].schema, fs[i].schemaName];
            }
        }
    }

    getFilePath(file)
    {
        var fs = this.scf.fs;
        for(var i=0;i<fs.length;i++)
        {
            if(fs[i].id == file){
                return fs[i].path;
            }
        }
    }


}


module.exports = SCF;