var GET = require('./get.ts'); // get nodes data from cache and store
var PUT = require('./put.ts'); // get nodes data from cache and store
var DUP = require('./dup'), dup = DUP(); // check and track data
var recovery = require('./storage/checkpoint.ts'); // build recover checkpoints
var opt = require('../ddeep.config'); // peer configurations

// Setup process peers and graph to build some pooling functionality
process.PEERS = [];
let graph = {};

// Setup opt
var port = opt.port || 9999;
var storage = opt.storage || false;
var checkpoint = opt.checkpoint || false;
var logs = opt.logs || false;

// Create the server
const fastify = require('fastify')();
fastify.register(require('@fastify/websocket'));

// Call a chackpoint recovery if enabled
(storage && checkpoint) ? recovery(checkpoint) : null;
(logs) ? console.log({ listening: true, port, storage }) : null;

// handle new connections to ws
fastify.register (async function (fastify) {

    fastify.get('/', { websocket: true }, peer => {

        // push the new peer
        peer.listeners = [];
        peer._id = (Date.now()*Math.random()).toString(36);
        process.PEERS.push(peer);
    
        // handle messages
        peer.socket.on('message', data => {
    
            var msg = JSON.parse(data);
    
            if (dup.check(msg['#'])) return;
            dup.track(msg['#']);
    
            (msg.put) ? PUT(msg, graph, storage)
            : (msg.get) ? GET(peer, msg, graph)
            : null;
    
        });
    
        // pop peer when connection is closed
        peer.socket.on('close', () => {
            process.PEERS.pop(process.PEERS.indexOf(peer));
        })
    
    });

});

fastify.listen({ port }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

/*

    for developemt! (by Kais Radwan)

    the new data schema should be based on the following schema:

    put data:

    {
        collection: {
            #: dup.track(Dup.random()),
            _: {
                '#': 'collection_id/node_id',
                '.': 'proprty',
                '>': {
                    data.*: Date.now()
                }
            },
            _a: ddeep.auth(), // implemented later
            persistent: "weak" || "strong" || "cache" || null,
            put: {...data}
        }
    }

    get data:

    {
        collection: {
            get: {
                '#': 'collection_id' || 'collection_id/node_id',
                ?? '.': 'property'
            },
            _a: ddeep.auth(), // implemented later
            opt: {...} // implemented later
        }
    }

*/
