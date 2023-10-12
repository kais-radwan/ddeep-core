// just basics
require('colors');
var fs = require('fs');

// commands interface
var readline = require('readline'); // process inputs
var CP = require('../lib/commands'); // Commands processor

// storage and data operations
var GET = require('./get');
var PUT = require('./put');
var recovery = require('./storage/checkpoint'); // build recover checkpoints
var DUP = require('./dup'), dup = DUP(); // check and track data

// configurations
var opt = require('../ddeep.config'); // ddeep configurations

// create command interface inputs
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

// Setup opt
let graph = {};
var port = opt.port || 9999;
var storage = opt.storage || false;
var checkpoint = opt.checkpoint || false;

// add options to the process
process.PEERS = [];
process.storage = storage;
process.port = port;
process.checkpoint = checkpoint;
process.listeners = {};

// Create the server
const fastify = require('fastify')();
fastify.register(require('@fastify/websocket'));

if (storage && checkpoint) {
    recovery(checkpoint);
}

// register fastify server
fastify.register(async function (fastify_socket) {

    try {
        // read command interface entry and options
        fs.readFile('./lib/entry/ascii.txt', {}, (error, content) => {

            console.clear();
            console.log("\n", `${content}`.blue, "\n");
            console.log("port -> ".yellow, `${port}`.gray);
            console.log("storage -> ".yellow, `${storage}`.gray, "\n");

            if (error) {
                return;
            } else {
                content = content.toString();
                receiveCommand();
            }

        })
    } catch (err) {
        // I'm afraid some cloud hosting services would cause some issues.
        // but no need to do anything.
    };

    // handle new socket connections
    fastify_socket.get('/', { websocket: true }, peer => {

        // push the new peer
        peer.listeners = [];
        peer._id = (Date.now() * Math.random()).toString(36);
        process.PEERS.push(peer);

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
                GET(peer, msg, graph, process.storage);
            }

        });

        // pop peer when connection is closed
        peer.socket.on('close', () => {
            process.PEERS.pop(process.PEERS.indexOf(peer));
        })

    });

});

// listen to config port using fastify
fastify.listen({ port }, err => {
    if (err) {
        console.error(err.red);
    }
});

var receiveCommand = () => {

    rl.question(`ddeep@${port}`.brightGreen + '$ ', async (command) => {

        if (command) {

            command = command.split(" ");
            await CP.emit(command[0], command);

        }

        receiveCommand();
    })

};