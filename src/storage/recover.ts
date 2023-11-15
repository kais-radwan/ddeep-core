
let fs = require('node:fs');
let point = process.argv[2];

if (!point) {
    console.log('Please pass the recover point id to recover data from');
    process.exit(1);
}

console.log(`Recovering data from ${point}`);

// Copy the recovery point directory to the deep data directory.
fs.cp(`./recovery/${point}`, './ddeep_data', { recursive: true }, (err: any) => {

    if (err) {
        console.error(err);
        process.exit(1);
    }

    // Log a success message.
    console.log({ success: `restored to checkpoint '${point}' successfully!` });

});