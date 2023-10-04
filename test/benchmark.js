var benchmark = require('benchmark');
var get = require('../dev/get');
var put = require('../dev/put');
var Dup = require('../lib/dup'), dup = Dup(); // check and track data

const suite = new benchmark.Suite();

var msg = {
      '#': dup.track(Dup.random()),
      put: {
        "people/mark": {_: {'#': 'people/mark', '>': {name: Date.now()}},
          name: "Mark Nadal 7"
        }
      },
			auth: true
    }

console.log(true)

suite
    .add('Put', async () => {
        await put(msg, /*{'people/kais': {name: 'Kais Radwan 3'}}*/ {})
    })
    .add('Get', async () => {
	await get(null, msg, {})
    })
    .on('Get', (data) => {
	console.log(data)
    })
    .on('Put', (data) => {
        console.log(data);
    })
    .on('cycle', event => {
        console.log(event.target.toString());
      })
    .run()
