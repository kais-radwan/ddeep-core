import dup from './dup'; // just to generate some random IDs
import recover from './storage/checkpoint';
import opt from '../ddeep.config'; // ddeep configurations
import get from './get';
import put from './put';

interface Options {
    _id: string
}

// globals
let graph: any = {};

// options
let storage: true | false = opt.storage;
let checkpoint = opt.checkpoint;
let graph_timer = opt.reset_graph || 0;
let whitelist = opt.whitelist || [];

const server = Bun.serve<Options>({

    fetch(req, server) {

        // create a unquie id for this peer
        let _id = dup.random();

        // Upgrade connection
        const success = server.upgrade(req, {
            data: {
                _id
            }
        });

        // if the connection is upgraded just return
        if (success) {
            return undefined;
        }

        // if connection is not upgraded return a response
        return new Response('ddeep-core: open websocket connections please...');

    },

    websocket: {

        open: (ws) => {
            console.log(ws);
        },

        message: (ws, message: string) => {

            let data = JSON.parse(message);

            // check if message ID already tracked
            if (dup.check(data['#'])) { return undefined };
            dup.track(data['#']);

            if (data.put) {

                put(ws, data, graph, storage);

            }

            else if (data.get) {

                get(ws, data, graph, storage);

            }

        },

    }

})

// start recovery function if a checkpoint timer is in palce and storage enabled
if (storage && checkpoint) {
    recover(checkpoint);
}

// clear graph based on the reset_graph timer
if (Number(graph_timer) > 0) {
    clear_graph(graph_timer);
}

// clear graph every ms
async function clear_graph (timer: number) {
    if (timer < 1000) { return undefined };
    Bun.sleep(timer);
    graph = {};
    clear_graph(timer);
}

console.log(`ddeep-core is listening on ${server.hostname}:${server.port}`);