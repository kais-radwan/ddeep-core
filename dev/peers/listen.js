function listen (graph, peer) {
    
    if (peer && graph) {
    
        var nodes = [];
        var props;
        var dynamic_graph;

        if (graph.includes('.')) {
            nodes = graph.split('.')[0].split('/');
            props = graph.split('.')[1];
        } else {
            nodes = graph.split('/');
        }
    
        process.PEERS[process.PEERS.indexOf(peer)].listeners.push(...nodes);

        nodes.forEach(node => {
            if (!dynamic_graph) {
                dynamic_graph = node;
            } else {
                dynamic_graph = `${dynamic_graph}/${node}`;
            }
            if (process.listeners[dynamic_graph]) {
                process.listeners[dynamic_graph].push(peer);
            } else {
                process.listeners[dynamic_graph] = [peer];
            }
        });

        if (props) {
            dynamic_graph = `${dynamic_graph}.${props}`;
            if (process.listeners[dynamic_graph]) {
                process.listeners[dynamic_graph].push(peer);
            } else {
                process.listeners[dynamic_graph] = [peer];
            }
        }

    }

}

module.exports = listen;