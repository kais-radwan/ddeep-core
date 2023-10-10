var PE = require('./peers/emitter'); // peers emitter
var store = require('./storage/store'); // read and write data to storage
var Dup = require('./dup'), dup = Dup(); // check and track data
var HAM = require('./ham'); // conflict resolution algorithm
var SCANNER = require('./policies/scanner2.ts'); // scan and process policies

type putMsg = {
    '#': string,
    'put': any
}

var put = async function (msg:putMsg, graph:any, storage:true|false) {

    try {

        var soul:string = msg.put[Object.keys(msg.put)[0]]._["#"];
        var prop = msg.put[Object.keys(msg.put)[0]]._["."];
        if (prop) soul = `${soul}+.${prop}`;

        SCANNER(soul, "put", msg.put, () => {

            var change = HAM.mix(msg.put, graph);

            // if storage is enabled, save data and stream it
            if (storage) {
                store.put(change, function (err:any, ok:any) {

                    if (err) {
                        console.log(err.red);
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