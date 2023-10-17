// Recover the data to a point of recovery. It's as simple as copying a directory.
const { program } = require('commander');
require('colors');
const fs = require('fs');

// Define the command line options.
program
  .option('-p <point>', 'Recover data to a recovery checkpoint.')
  .option('-h', 'Display this help message.');

// Parse the command line options.
program.parse();

// Get the options.
const options = program.opts();
const point = options.p;
const help = options.h || options.help;

// If the help flag is set, display the help message and exit.
if (help) {
  console.log(`
-p <point>      Recover data to a recovery checkpoint.

-h               Display this help message.
`);
  process.exit(0);
}

// If the point option is not set, display an error message and exit.
if (!point) {
  console.error('\n:('.red + ' Please set the point you want to recover to.\n\ncheck \'/recovery\' directory to see all available points of recovery and then pass \'-p POINT\'');
  process.exit(1);
}

// Copy the recovery point directory to the deep data directory.
fs.cp(`./recovery/${point}`, './ddeep_data', { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  // Log a success message.
  console.log({ success: `restored to checkpoint '${point}' successfully!` });
});
