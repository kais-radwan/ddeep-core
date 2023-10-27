import dup from './dup'; // just to generate some random IDs
import store from './storage/store'; // read and write data to storage
import scanner from './policies/scanner';
import read_graph from './storage/read_graph';
import ham from './ham';

interface GetData {
    '#': string,
    'get': {
        '#': string,
        '.': any,
    },
}

const get = (ws: any, data: GetData, graph: any, storage: true | false, subscribe: true | false): void => {

    if (typeof data.get !== 'object' || data.get === null) { return undefined };

    let soul: string = data?.get["#"] || '';
    let prop = data?.get["."];

    if (soul.substring(0, 2) == '~~') { return undefined };

    if (prop) {
        if (soul.includes('/')) {
            soul = `${soul}.${prop}`;
        } else {
            soul = `${soul}/${prop}`;
        }
    }

    try {

        let ack = read_graph(data.get, graph);

        if (ack) {
            scanner(soul, 'get', ack, () => {
                let res: any = {
                    '#': dup.track(dup.random()),
                    '@': data['#'],
                    put: ack,
                    err: null
                }
                ham.mix(ack, graph);
                if (subscribe) {
                    ws.subscribe(soul);
                }
                ws.send(JSON.stringify(res));
            })
        }

        else if (!ack && storage) {
            store.get(data.get, (err: any, ack: any) => {

                if (err) { return undefined };

                scanner(soul, 'get', ack, () => {
                    let res = {
                        '#': dup.track(dup.random()),
                        '@': data['#'],
                        put: ack,
                        err: err
                    }
                    ham.mix(ack, graph);
                    if (subscribe) {
                        ws.subscribe(soul);
                    }
                    ws.send(JSON.stringify(res));
                })

            })
        }

    } catch (err) { }; // no need to do anything here

}

export default get;