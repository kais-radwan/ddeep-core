// just basics
require('colors');
var fs = require('fs');

// commands interface
var readline = require('readline'); // process inputs
var CP = require('../lib/commands/processor'); // Commands processor

// storage and data operations
var GET = require('./get');
var PUT = require('./put');
var recovery = require('./storage/checkpoint'); // build recover checkpoints
var DUP = require('./dup'), dup = DUP(); // check and track data

// configurations
var opt = require('../ddeep.config'); // ddeep configurations
const { listeners } = require('process');

// Setup opt
let graph = {};
var port = opt.port || 9999;
var storage = opt.storage || false;
var checkpoint = opt.checkpoint || false;
var graph_timer = opt.reset_graph || 0;
var listeners_timer = opt.reset_listeners || 0;
var whitelist = opt.whitelist || [];
let interface_prompt;

// add options to the process
process.PEERS = {};
process.storage = storage;
process.port = port;
process.checkpoint = checkpoint;
process.listeners = {};

// Create the server
const fastify = require('fastify')();
fastify.register(require('@fastify/websocket'));

// start recovery function if a checkpoint timer is in palce and storage enabled
if (storage && checkpoint) {
    recovery(checkpoint);
}

// clear graph based on the reset_graph timer
if (Number(graph_timer) > 0) {
    clear_graph(graph_timer);
}

// clear listeners based on the reset_listeners timer
if (Number(listeners_timer) > 0) {
    clear_listeners(listeners_timer);
}

// register fastify server
fastify.register(async function (fastify_socket) {

    try {
        // read command interface entry and options
        fs.readFile('./lib/entry/ascii.txt', {}, (error, content) => {

            console.clear();

            if (error) {
                return;
            } else if (content) {
                content = content.toString();
                console.log("\n", `${content}`.blue, "\n");
            }

            console.log("port -> ".yellow, `${port}`.gray);
            console.log("storage -> ".yellow, `${storage}`.gray, "\n");
            
            // create command interface inputs
            interface_prompt = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            })

            receive_command();

        })
    } catch (err) {
        // I'm afraid some cloud hosting services would cause some issues.
        // but no need to do anything.
    };

    // handle simple http serving
    fastify_socket.get('/', (req, reply) => {
        reply.send(`open socket connections to /ddeep`);
    })

    // handle new socket connections
    fastify_socket.get('/ddeep', { websocket: true }, (peer, req) => {

        // get the IP address of the peer connecting to the core
        var peer_ip = req.socket.remoteAddress;

        // check if ip address is in the whitelist to be able to connect
        if (whitelist.length > 0 && whitelist.indexOf(peer_ip) === -1) {
            peer.socket.send('ACCESS DENIED: you are not allowed to connect to this core...');
            peer.socket.close();
        }

        // push the new peer
        peer.listeners = [];
        var _id = 'peer:' + (Date.now() * Math.random()).toString(36);
        peer._id = _id;
        process.PEERS[_id] = peer;

        // handle messages
        peer.socket.on('message', (data) => {

            // parse message to JSON
            var msg = JSON.parse(data);

            // check message's ID. return if already tracked, and track it if new
            if (dup.check(msg['#'])) { return };
            dup.track(msg['#']);

            // handle put data
            if (msg.put) {
                PUT(msg, graph, process.storage);
            }

            // handle get data
            else if (msg.get) {
                GET(peer._id, msg, graph, process.storage);
            }

        });

        // delete peer when connection is closed
        peer.socket.on('close', () => {

            try {
                delete process.PEERS[peer._id];
                peer.listeners.forEach(listener => {
                    console.log(listener);
                    delete process.listeners[listener][process.listeners[listener].indexOf(peer._id)];
                    process.listeners[listener] = process.listeners.pop(process.listeners[listener].indexOf(peer._id));
                })

            } catch (err) {} // no need to do anything

        })

    });

});

// listen to config port using fastify
fastify.listen({ port }, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});

function receive_command () {

    if (!interface_prompt) {
        return undefined;
    }

    interface_prompt.question('ddeep > ', async (command) => {

        if (command) {
            command = command.split(" ");
            await CP.emit(command[0], command);
        }

        receive_command();
    })

};

// clear graph every ms
function clear_graph (timer) {
    if (timer < 1000) {
        console.log('\nCancelling clear_graph as it is less than 1000ms and would cause issues\n'.red);
        return;
    }
    setTimeout( () => {
        graph = {};
        clear_graph(timer);
    }, timer);
}

// clear listeners every ms
function clear_listeners (timer) {
    if (timer < 1000) {
        console.log('\nCancelling clear_listeners as it is less than 1000ms and would cause issues\n'.red);
        return;
    }
    setTimeout( () => {
        process.listeners = {};
        clear_listeners(timer);
    }, timer);
}
