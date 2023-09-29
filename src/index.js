
const { program } = require('commander');

program
    .option('-p, --port <port>');

program.parse();

var options = program.opts();
console.log(options);