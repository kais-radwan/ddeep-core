var PE = require('./peers/emitter'); // peers emitter
var store = require('./storage/store'); // read and write data to storage
var Dup = require('./dup'), dup = Dup(); // check and track data
var SCANNER = require('./policies/scanner2.ts'); // scan and process policies
var RFG = require('./storage/get_from_graph'); // read data from pooling graph
var listen = require('./peers/listen'); // add listeners to peers

type msg = {
    '#': string,
    'get': {
        '#': string,
        '.': any,
    },
}

var get = function (peer:any, msg:msg, graph:any, storage:true|false) {

    var soul:string = msg?.get["#"];
    var prop = msg?.get["."];
    if (prop) soul = `${soul}+.${prop}`;

    try {

        var ack = RFG(msg.get, graph);

        if (ack) {
            SCANNER(soul, "get", ack, () => { 
                if (peer) listen(soul, peer);
                PE.emit('get', peer, {
                    '#': dup.track(Dup.random()),
                    '@': msg['#'],
                    put: ack,
                    err: null
                })
            });
        }

        if (!ack && storage){
            store.get(msg.get, (err:any, ack:any) => {
                SCANNER(soul, "get", ack, () => {
                    if (peer) listen(soul, peer);
                    PE.emit('get', peer, {
                        '#': dup.track(Dup.random()),
                        '@': msg['#'],
                        put: ack,
                        err: err
                    });
                });
            });
        }

    } catch (err) {}; // no need to do anything here...

};

module.exports = get;