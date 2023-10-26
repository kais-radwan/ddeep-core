let Radix = require('./radix');
let Radisk = require('./radisk');
let fs = require('node:fs');
let crypto = require('node:crypto');

interface APIType {
  put: Function,
  get: Function
};

interface LexData {
  '#': string,
  '.': string
};

interface StoreType {
  get: Function,
  put: Function,
  list: Function,
  file: string
}

const store: StoreType = {

  file: 'ddeep_data',

  put: async (file: string, data: any, cb: Function) => {

    // generate a random tmp file name
    const random = crypto.randomBytes(32).toString('hex').slice(-3);

    // write data to the tmp file
    await Bun.write(`${store.file}/${random}.tmp`, data);

    // rename the tmp file to the main data file
    fs.rename(`${store.file}/${random}.tmp`, `${store.file}/${file}`, cb);

  },

  get: async (file: string, cb: Function) => {

    try {

      let data: any;
      const value = Bun.file(`${store.file}/${file}`);
      data = await value.text();

      if (data) {
        cb(null, data);
      }

    }

    catch (err: any) {
      if (err.code === 'ENOENT') { return cb() };
      cb(err, undefined);
    }

  },

  list: (cb: Function) => {

    fs.readdir(store.file, (err: any, dir: any) => {
      dir.forEach(cb)
      cb();
    })

  }

}

function Store() {

  if (!fs.existsSync(store.file)) { fs.mkdirSync(store.file) }
  return store;

}

const rad = Radisk({ store: Store() });

const API: APIType = {

  put: (graph: any, cb: Function) => {

    if (!graph) { return undefined };
    let c = 0;

    Object.keys(graph).forEach(function (soul) {
      const node = graph[soul];

      Object.keys(node).forEach(function (key) {
        if (key == '_') { return undefined };
        c++;
        const val = node[key]; const state = node._['>'][key];
        rad(soul + '.' + key, JSON.stringify([val, state]), ack);
      })

    })

    function ack(err: any, ok: number) {
      c--;
      if (err) {
        cb(err || 'ERROR!');
        return undefined;
      }

      if (c > 0) { return undefined };
      cb(err, 1);
    }

  },

  get: (lex: LexData, cb: Function) => {

    if (!lex || typeof lex !== 'object') { return undefined };

    const soul = lex['#'];
    const key = lex['.'] || '';
    const tmp = soul + '.' + key;
    let node: any;

    rad(tmp, function (err: any, val: any) {
      let graph: any;
      if (val) {
        Radix.map(val, each);
        if (!node) { each(val, key) };
        graph = {};
        graph[soul] = node;
      }
      cb(err, graph);
    })

    function each(val: any, key: any) {
      const data = JSON.parse(val);
      node = node || {
        _: {
          '#': soul,
          '>': {} 
        } 
      };
      node[key] = data[0];
      node._['>'][key] = data[1];
    }

  }

}

export default API;