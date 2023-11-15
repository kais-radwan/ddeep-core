import store from '../storage/store';
import ham from '../ham';

interface UserData {
    new : true,
    identifier: string,
    password: string
    metadata: any
}

const create_user = (ws: any, data: UserData, cost: number, graph: any, storage: true | false): void => {

    try {

        if (cost > 31) { cost = 31 };
        if ( cost < 4) { cost = 4 };

        const identifier = data.identifier;
        const password = data.password;
        const metadata = data.metadata || {};

        if (!identifier || !password) { return undefined };

        const hashed_password = Bun.password.hashSync(password, {
            algorithm: 'bcrypt',
            cost
        });

        const put_data: any = {};

        put_data[`~~/${identifier}`] = {
            "_": {
                ">": {},
                "#": `~~${identifier}`
            },
            identifier,
            password: hashed_password
        }

        for (let key in metadata) {
            put_data[key] = metadata[key];
            put_data._['>'][key] = Date.now();
        }

        let change = ham.mix(put_data, graph);

        if (storage) {
            store.put(change);
        }

        ws.send(JSON.stringify({
            err: null,
            ok: 1
        }));

    }

    catch (err: any) {
        ws.send(JSON.stringify({
            err: err.message,
            ok: 0
        }))
    }

}

export default create_user;