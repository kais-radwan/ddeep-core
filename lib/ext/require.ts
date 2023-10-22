let builtin = require("./built-in/index");

let ext;

try {
    ext = require("../../extensions.config.js");
} catch(err) {
    console.log('extensions.config not found');
}

type extType = {
    name: string,
    callback: Function
}

if (!ext) {
    ext = [];
}

let extensions = builder([...ext, ...builtin]);

let root = {

    load: (extName:string) => {
        let ext = extensions[extName];
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