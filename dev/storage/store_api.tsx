let Radix = require('./radix');
let Radisk = require('./radisk');
let Store = require('./store');
let rad = Radisk({ store: Store() })

interface APIType {
    put: Function,
    get: Function
};

interface LexData {
    '#': any,
    '.': any
};

let API: APIType = {

    get: (lex: LexData, cb: Function) => {

        if (!lex) { return undefined };

        let soul = lex['#'];
        let key = lex['.'] || '';
        let tmp = soul + '.' + key;
        let node: any;

        rad(tmp, (err: any, val: any) => {

            let graph: any = {};

            if (val) {
                Radix.map(val, each)
                if (!node) { each(val, key) }
                graph = {}
                graph[soul] = node
            }

            cb(err, graph)

        })

        function each(val: string, key: string) {
            let data = JSON.parse(val);
            node = node || { _: { '#': soul, '>': {} } };
            node[key] = data[0];
            node._['>'][key] = data[1];
        }

    },

    put: (graph: any, cb: Function) => {

        if (!graph) { return };
        let c = 0

        Object.keys(graph).forEach(function (soul) {

            let node = graph[soul];

            Object.keys(node).forEach(function (key) {
                if (key == '_') { return };
                c++;
                const val = node[key]; const state = node._['>'][key];
                rad(soul + '.' + key, JSON.stringify([val, state]), ack);
            })

        });

        let ack = (err: any, ok: any) => {
            c--;
            if (err = err) {
                cb(err || 'ERROR!');
                return;
            }
            if (c > 0) { return };
            cb(null, 1);
        }

    }

};

module.exports = API