var PE = require('./peers/emitter'); // peers emitter
var store = require('./storage/store'); // read and write data to storage
var Dup = require('./dup'), dup = Dup(); // check and track data
var HAM = require('./ham'); // hypertext abstract machine
var SCANNER = require('./policies/scanner'); // scan and process policies
var policies = require('../policies.config'); // policies

type putMsg = {
    '#': string,
    'put': any
}

var put = async function (msg:putMsg, graph:any) {

    try {

        var soul = msg.put[Object.keys(msg.put)[0]]._["#"];

        (soul) ? soul = soul.split('/') : null;

        SCANNER(soul, "write", policies, {data: msg.put, instance: msg}, () => {
            var change = HAM.mix(msg.put, graph);

            store.put(change, function (err:any, ok:any) {

                (err) ? console.log(err.red) : null;

                PE.emit('put', soul, {
                    '#': dup.track(Dup.random()),
                    '@': msg['#'],
                    err: err,
                    ok: ok,
                    put: msg.put
                });

            });
        });

    } catch (err) {};

}

module.exports = put;