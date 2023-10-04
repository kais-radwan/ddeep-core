var events = require('events');

var PE = new events();

PE.on('get', (peer, data) => {

    if (!peer) return;

    try {
        peer.socket.send(JSON.stringify(data));
    } catch (err) {};

});

PE.on('put', (nodes, data) => {

    var peers = process.PEERS;

    peers.forEach(peer => {

        var listeners = peer.listeners;
        var mappingNodes;
        var send = false;

        if (listeners){

            mappingNodes = (nodes.length > listeners.length) ? nodes
            : (nodes.length < listeners.length) ? listeners
            : nodes;

            mappingNodes.forEach( (node) => {

                var listenerValue = listeners[nodes.indexOf(node)];

                send = (!listenerValue || listenerValue === node) ? true
                : false;
            
            });

            (send) ? peer.socket.send(JSON.stringify(data)) : null;

        }

    });

});

module.exports = PE;