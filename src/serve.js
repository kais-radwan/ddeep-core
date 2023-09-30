var ws = require('ws');
var GET = require('./get');
var HAM = require('./ham');
var Dup = require('./dup'), dup = Dup();
var store = require('./storage/store');
var opt = require("../ddeep.config");
var policies = require("../policies.config");
var SCANNER = require("./policies/scanner");

var peers = [];
var graph = {};

var port = opt.port;
var storage = opt.storage; 
var logs = opt.logs;

if (!port) port = 9999;
if (storage !== true && storage !== false) storage = false;

var wss = new ws.Server({ port: port });

if (logs) console.log({ running: true, port, storage });

wss.on('connection', function (peer) {
    peers.push(peer);
    peer.on('message', function (data) {
        var msg = JSON.parse(data);
        if (dup.check(msg['#']))
            return;
        dup.track(msg['#']);

        if (msg.put && storage) putData(msg);
        if (msg.put) HAM.mix(msg.put, graph);

        if (msg.get) getData(msg);

    });
});

var getData = async function (msg) {

    var soul = msg?.get["#"];
    var prop = msg?.get["."];
    if (soul) soul = soul.split("/");
    if (prop) soul.push(prop);

    var ack = GET(msg.get, graph);

    if (ack) {

        var err;

        var allowed = await SCANNER(soul, "read", policies, {
            data: ack,
            instance: msg
        });

        if (!allowed){
            ack = null;
            err = "Access denied";
        }

        emit(JSON.stringify({
            '#': dup.track(Dup.random()),
            '@': msg['#'],
            put: ack,
            err: err
        }));

    }

    if (!ack) {

        store.get(msg.get, async function (err, ack) {

            var allowed = await SCANNER(soul, "read", policies, {
                data: ack,
                instance: msg
            });

            if (!allowed){
                ack = null;
                err = "Access denied";
            }

            emit(JSON.stringify({
                '#': dup.track(Dup.random()),
                '@': msg['#'],
                put: ack,
                err: err
            }));

        });

    }

};
var putData = function (msg) {

    var change = HAM.mix(msg.put, graph);

    store.put(change, function (err, ok) {

        if (err && logs) console.log(err.red);

        emit(JSON.stringify({
            '#': dup.track(Dup.random()),
            '@': msg['#'],
            err: err,
            ok: ok
        }));

    });

};
var emit = function (data) {
    peers.forEach(function (peer) {
        try {
            peer.send(data);
        }
        catch (e) { if (logs) console.log(e); }
    });
};