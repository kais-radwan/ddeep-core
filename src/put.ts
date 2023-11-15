import dup from './dup'; // just to generate some random IDs
import store from './storage/store'; // read and write data to storage
import scanner from './policies/scanner';
import ham from './ham';
import { ServerWebSocket } from 'bun';
import { Options } from './serve';

type PutData = {
    '#': string,
    'put': any
}

type PutOptions = {
    ws: ServerWebSocket<Options>,
    data: PutData,
    graph: any,
    storage: boolean,
    metadata?: any
}

const put = (options: PutOptions): void => {

    const ws = options.ws;
    const data = options.data;
    const storage = options.storage;
    const metadata = options.metadata || {};

    try {

        let soul: string = '';

        for (let key in data.put) {
            let node = data.put[key]._['#'];
            soul = node;
        }

        scanner(soul, "put", {ack: data.put, metadata}, () => {

            let change = ham.mix(data.put, options.graph);

            // if storage is enabled, save data and stream it
            if (storage) {
                store.put(change, () => {}); // we won't do anything here. we'll just ignore it
            }

            let res = {
                '#': dup.track(dup.random()),
                '@': data['#'],
                err: null,
                ok: 1,
                put: data.put
            }

            ws.publish(soul, JSON.stringify(res));

        });

    } catch (err) {}; // no need to do anything here

}

export default put;