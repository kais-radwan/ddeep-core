var { exec } = require('child_process');
var colors = require('colors');
var program = require('commander');

console.log(`\nBuilding ddeep-core`);
console.log(`Cloning...`);

exec(`git clone https://github.com/kais-radwan/ddeep-core ${process.cwd()}`, (error) => {

    if (error) {
        console.log(`${error}`.red);
        process.exit();
    }else {
        console.log(`Installing dependencies...`);

        exec(`npm install`, (error) => {
            if (error){
                console.log(`${error}`.red);
                process.exit();
            } else {
                console.log('Done\n'.green);
                console.log('Next: npm start\n');
                process.exit();
            }
        })
    }

});