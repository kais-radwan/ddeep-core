import dup from './dup'; // just to generate some random IDs
import recover from './storage/checkpoint';
import opt from '../ddeep.config'; // ddeep configurations

import get from './get';
import put from './put';
import unsubscribe from './unsubscribe';

interface Options {
    _id: string
}

// globals
let graph: any = {};

const server = Bun.serve<Options>({

    fetch(req, server): void | any {

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

        open: (ws): void => { },

        message: (ws, message: string): void => {

            let operations: Array<any> = [];
            let data = JSON.parse(message);

            if (message.substring(0, 1) === '[') {
                operations = [...data];
            } else {
                operations.push(data);
            }

            operations.forEach(operation => {

                // check if message ID already tracked
                if (dup.check(operation['#'])) { return undefined };
                dup.track(operation['#']);

                if (operation.put) {
                    put(ws, operation, graph, opt.storage);
                }

                if (operation.get) {
                    get(ws, operation, graph, opt.storage, true);
                }

                if (operation.unsubscribe) {
                    unsubscribe(ws, operation);
                }

                // COMING SOON !!!
                if (operation.auth) {
                    // if (operation.auth.new) {
                    //     create_user(ws, operation.auth, opt.encryption_cost, graph, opt.storage);
                    // }
                    // else {
                    //     verify_user(ws, operation.auth, graph, opt.storage);
                    // }
                }

            })

        },

    }

})

// start recovery function if a checkpoint timer is in palce and storage enabled
if (opt.storage && opt.checkpoint) {
    recover(opt.checkpoint);
}

// clear graph based on the reset_graph timer
if (Number(opt.reset_graph) > 0) {
    clear_graph(Number(opt.reset_graph));
}

// clear graph every ms
async function clear_graph(timer: number) {
    if (timer < 1000) { return undefined };
    Bun.sleep(timer);
    graph = {};
    clear_graph(timer);
}

console.log(`ddeep-core is listening on ${server.hostname}:${server.port}`);