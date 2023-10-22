let PE = require('./peers/emitter'); // peers emitter
let store = require('./storage/store'); // read and write data to storage
let Dup = require('./dup'), dup = Dup(); // check and track data
let SCANNER = require('./policies/scanner2.ts'); // scan and process policies
let RFG = require('./storage/get_from_graph'); // read data from pooling graph
let listen = require('./peers/listen'); // add listeners to peers

type msg = {
    '#': string,
    'get': {
        '#': string,
        '.': any,
    },
}

let get = function (peer: any, msg: msg, graph: any, storage: true|false) {

    let soul:string = msg?.get["#"];
    let prop = msg?.get["."];
    if (prop) {
        soul = `${soul}.${prop}`;
    }

    try {

        let ack = RFG(msg.get, graph);

        if (ack) {
            SCANNER(soul, "get", ack, () => {
                listen(soul, peer);
                PE.emit('get', peer, {
                    '#': dup.track(Dup.random()),
                    '@': msg['#'],
                    put: ack,
                    err: null
                })
            });
        }

        else if (!ack && storage){
            store.get(msg.get, (err:any, ack:any) => {
                SCANNER(soul, "get", ack, () => {
                    listen(soul, peer);
                    PE.emit('get', peer, {
                        '#': dup.track(Dup.random()),
                        '@': msg['#'],
                        put: ack,
                        err: err
                    });
                });
            });
        }

        else {
            listen(soul, peer);
        }

    } catch (err) {}; // no need to do anything here...

};

module.exports = get;