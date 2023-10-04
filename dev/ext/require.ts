var builtin = require("./built-in/index");
var ext = require("../../extensions.config");

type extType = {
    name: string,
    callback: Function
}

let extensions = builder([...ext, ...builtin]);

var root = {

    load: (extName:string) => {
        var ext = extensions[extName];
        if (ext) return ext;
        if (!ext) throw new Error(`Extension ${extName} not found`);
    }
}

function builder (data:Array<extType>) {

    let build:any = {};

    data.forEach( (ext:extType) => {
        build[ext.name] = ext.callback;
    })

    return build;

}

module.exports = root;