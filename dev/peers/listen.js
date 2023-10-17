function listen (graph, peer) {

    if (peer && graph) {

        var nodes = [];
        var props;

        if (graph.includes('.')) {
            nodes = graph.split('.')[0];
            props = graph.split('.')[1];
        } else {
            nodes = graph;
        }

        if (process.listeners[nodes]) {
            if (process.listeners[nodes].indexOf(peer) === -1) {
                process.listeners[nodes].push(peer);
            }
        }

        else if (!process.listeners[nodes]) {
            process.listeners[nodes] = [peer];
        }

        if (props) {
            if (process.listeners[graph]) {
                if (process.listeners[graph].indexOf(peer) === -1) {
                    process.listeners[nodes].push(peer);
                }
            }
            else if (!process.listeners[graph]) {
                process.listeners[graph] = [peer];
            }
        }

    }

}

module.exports = listen;