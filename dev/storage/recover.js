/*
    Recover the data to a point of recovery. It's as simply as copying a directory
*/

var {program} = require("commander");
var colors = require("colors");
var fs = require("fs");

program
    .option('-p <point>')
    .option('-h');

program.parse();

var options = program.opts();
var point = options.p;
var help = options.h || options.help;

(help) ? 
    console.log(`
-p <point>      Recover data to a recovery checkpoint

-h               Display this help message
`)

: (!point) ? console.error("\n:(".red + ` Please set the point you want to recover to.\n\ncheck '/recovery' directory to see all available points of recovery and then pass '-p POINT'`)

: (point) ?
    fs.cp(`./recovery/${point}`, "./ddeep_data", { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log({success: `restored to checkpoint '${point}' successfully!`});
    })

: null;
