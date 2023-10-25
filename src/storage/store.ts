
let crypto = require('crypto');
let fs  = require('node:fs');

interface StoreOpt {
    file: string,
}

interface StoreType {
    get: Function,
    put: Function,
    list: Function
}

let opt: StoreOpt = {
    file: 'ddeep_data'
};

if (!fs.existsSync(opt.file)) {
    fs.mkdirSync(opt.file);
};

let Store: StoreType = {

    put: function (file: string, data: any, cb: Function) {

        try {
            let random = crypto.randomBytes(32).toString('hex').slice(-3);
            let tmp_file = Bun.file(`${opt.file}-${random}.tmp`);
            let writer = tmp_file.writer();
            writer.write(data);
            writer.flush();
            writer.end();
            fs.rename(`${opt.file}-${random}.tmp`, `${opt.file}/${file}`, (err: any) => {
                if (err) {
                    cb(err);
                }
            });
        }

        catch (err) {
            cb(err);
        }

    },

    get: function (file: string, cb: Function) {

        try {
            let data = Bun.file(`${opt.file}/${file}`, { type: 'application/json' });
            cb(null, data);
        }
        
        catch (err) {
            cb(err, undefined);
        }

    },

    list: function (cb: Function) {
        fs.readdir(opt.file, function (err: any, dir: any) {
            dir.forEach(cb);
            cb();
        })
    }

};

module.exports = Store;