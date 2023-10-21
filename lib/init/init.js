#!/usr/bin/env node
let cp = require('child_process');
let colors = require('colors');

console.log(`\nBuilding ddeep-core`);
console.log(`Cloning...`);

try {

    cp.spawnSync('/usr/bin/git',  ['clone',  'https://github.com/kais-radwan/ddeep-core', process.cwd()], { shell: false });
    console.log(`Installing dependencies...`);

    cp.spawnSync('/usr/bin/npm', ['install'], { cwd: process.cwd(), shell: false });
    console.log('Done\n'.green);
    console.log('Next: npm start\n');

} catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
}
