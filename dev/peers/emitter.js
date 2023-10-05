var EVENTS = require('events');

var PE = new EVENTS();

PE.on('get', (peer, data) => {

    if (!peer) { return; }

    try {
        peer.socket.send(JSON.stringify(data));
    } catch (err) {}; // we don't really need to do anything here. but we don't want any errors if there are problems sending data to peers

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

            if (send) {

                try {
                    peer.socket.send(JSON.stringify(data))
                } catch (err) {} // we don't really need to do anything here. but we don't want any errors if there are problems sending data to peers

            }

        }

    });

});

module.exports = PE;