import store from '../storage/store';
import read_graph from '../storage/read_graph';

interface UserData {
    identifier: string,
    password: string
}

const verify_user = (ws: any, data: UserData, graph :any, storage: true | false): void => {

    const identifier = data.identifier;
    const password = data.password;
    const soul = `~~/${identifier}`;

    if (!storage) {

        let ack = read_graph({ '#': soul, '.': null }, graph);

        if (!ack) {
            ws.send(JSON.stringify({
                err: 'NOT FOUND',
                ok: 0
            }));
            return undefined;
        }

        if (ack) {
            let source_password = ack[soul]['password'];
            const match = Bun.password.verifySync(password, source_password);

            if (match) {
                ws.send(JSON.stringify({
                    err: null,
                    ok: 1,
                    data: ack.metadata
                }))
            }

            else {
                ws.send(JSON.stringify({
                    err: 'Wrong identifier or password',
                    ok: 0
                }))
            }
            
        }

    }

    else {

        store.get({ '#': soul, '.': null }, (err: any, ack: any) => {

            if (err) {
                ws.send(JSON.stringify({
                    err,
                    ok: 0,
                }));
                return undefined;
            }

            let source_password = ack[soul]['password'];
            const match = Bun.password.verifySync(password, source_password);

            if (match) {
                ws.send(JSON.stringify({
                    err,
                    ok: 1,
                    data: ack.metadata
                }))
            }

            else {
                ws.send(JSON.stringify({
                    err: "Wrong identifier or password",
                    ok: 0
                }));
            }

        })

    }

}

export default verify_user;