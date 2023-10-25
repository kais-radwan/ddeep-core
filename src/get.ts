import dup from './dup'; // just to generate some random IDs
import store from './storage/store_api'; // read and write data to storage
import scanner from './policies/scanner';
import read_graph from './storage/read_graph';

interface GetData {
    '#': string,
    'get': {
        '#': string,
        '.': any,
    },
}

const get = (ws: any, data: GetData, graph: any, storage: true | false) => {

    let soul: string = data?.get["#"] || '';
    let prop = data?.get["."];
    if (prop) {
        soul = `${soul}.${prop}`;
    }

    try {

        let ack = read_graph(data.get, graph);
        
        if (ack) {
            scanner(ws.data._id, soul, 'get', ack, () => {
                let res: any = {
                    '#': dup.track(dup.random()),
                    '@': data['#'],
                    put: ack,
                    err: null
                }
                ws.publish(soul, JSON.stringify(res));
            })
        }

        else if (!ack && storage) {
            store.get(data.get, (err: any, ack: any) => {

                if (err) { return undefined };

                scanner(ws.data._id, soul, 'get', ack, () => {
                    let res = {
                        '#': dup.track(dup.random()),
                        '@': data['#'],
                        put: ack,
                        err: err
                    }
                    ws.publish(soul, JSON.stringify(res));
                })

            })
        }

    } catch (err) { }; // no need to do anything here

}

export default get;