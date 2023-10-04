var PE = require('./peers/emitter'); // peers emitter
var store = require('./storage/store'); // read and write data to storage
var Dup = require('./dup'), dup = Dup(); // check and track data
var SCANNER = require('./policies/scanner.ts'); // scan and process policies
var RFG = require('./storage/get_from_graph'); // read data from pooling graph
var listen = require('./peers/listen'); // add listeners to peers
var policies = require('../policies.config'); // policies

type msg = {
    '#': string,
    'get': {
        '#': string,
        '.': any,
    },
}

var get = async function (peer:any, msg:msg, graph:any) {

    var soul:any = msg?.get["#"];
    var prop = msg?.get["."];

    try {

        (soul) ? soul = soul.split('/') : null;
        (prop) ? soul.push(prop) : null;

        var ack = RFG(msg.get, graph);

        if (ack) {
            SCANNER(soul, "get", policies, {data: ack, instance: msg}, () => { 
                if (peer) listen(soul, peer);
                PE.emit('get', peer, {
                    '#': dup.track(Dup.random()),
                    '@': msg['#'],
                    put: ack,
                    err: null
                })
            });
        }

        if (!ack){
            store.get(msg.get, async (err:any, ack:any) => {
                SCANNER(soul, "get", policies, {data: ack, instance: msg}, () => {
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

    } catch (err) {};

};

module.exports = get;
