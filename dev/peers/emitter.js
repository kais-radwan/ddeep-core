var EVENTS = require('events');

var PE = new EVENTS();

PE.on('get', (peer, data) => {

    if (!peer) { return; }

    try {
        peer.socket.send(JSON.stringify(data));
    } catch (err) {}; // we don't really need to do anything here.

});

PE.on('put', (graph, data) => {

    var peers = [];
    var listening_peers = [];
    var nodes = [];
    var props;
    var dynamic_graph;

    if (graph.includes('.')) {
        nodes = graph.split('.')[0].split('/');
        props = graph.split('.')[1];
    } else {
        nodes = graph.split('/');
    }

    nodes.forEach(node => {
        if (!dynamic_graph) {
            dynamic_graph = node;
        }else {
            dynamic_graph = `${dynamic_graph}/${node}`;
        }
        if (process.listeners[dynamic_graph]) {
            listening_peers.push(...process.listeners[dynamic_graph]);
        }
    });

    if (props) {
        dynamic_graph = `${dynamic_graph}.${props}`;
        if (process.listeners[dynamic_graph]) {
            listening_peers.push(...process.listeners[dynamic_graph]);
        }
    }

    listening_peers.forEach(peer => {
        if (peers.indexOf(peer) === -1) {
            peers.push(peer);
            peer.socket.send(JSON.stringify(data));
        }
    })

});

module.exports = PE;