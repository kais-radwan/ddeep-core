let PE = require('./peers/emitter'); // peers emitter
let store = require('./storage/store'); // read and write data to storage
let Dup = require('./dup'), dup = Dup(); // check and track data
let HAM = require('./ham'); // conflict resolution algorithm
let SCANNER = require('./policies/scanner2.ts'); // scan and process policies

type putMsg = {
    '#': string,
    'put': any
}

let put = function (msg: putMsg, graph: any, storage: true|false) {

    try {

        let soul: any;

        for (let key in msg.put) {
            let node = msg.put[key]._['#'];
            soul = node;
        }

        SCANNER(soul, "put", msg.put, () => {

            let change = HAM.mix(msg.put, graph);

            // if storage is enabled, save data and stream it
            if (storage) {
                store.put(change, function (err:any, ok:any) {

                    if (err) {
                        console.error(`${err}`.red);
                    }

                })
            }

            PE.emit('put', soul, {
                '#': dup.track(Dup.random()),
                '@': msg['#'],
                err: null,
                ok: 1,
                put: msg.put
            });

        });

    } catch (err) {}; // no need to do anything here...

}

module.exports = put;