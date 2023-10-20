function listen(graph, peer) {

    if (!peer || !graph) { return };

    if (!process.PEERS[peer]) { return };

    if (process.listeners[graph]) {
        if (process.listeners[graph].indexOf(peer) === -1) {
            process.listeners[graph].push(peer);
        }
    }

    else if (!process.listeners[graph]) {
        process.listeners[graph] = [peer];
    }

}

module.exports = listen;