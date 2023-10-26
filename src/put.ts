import dup from './dup'; // just to generate some random IDs
import store from './storage/store'; // read and write data to storage
import scanner from './policies/scanner';
import ham from './ham';

type PutData = {
    '#': string,
    'put': any
}

const put = (ws: any, data: PutData, graph: any, storage: true | false) => {

    try {

        let soul: string = '';

        for (let key in data.put) {
            let node = data.put[key]._['#'];
            soul = node;
        }

        scanner(soul, "put", data.put, () => {

            let change = ham.mix(data.put, graph);

            // if storage is enabled, save data and stream it
            if (storage) {
                store.put(change, (err:any, ok:any) => {

                    if (err) {
                        console.error(`${err}`);
                    }

                })
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