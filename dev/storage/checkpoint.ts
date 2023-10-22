/*
    This simply create a point of recovery evrey amount of time you set in your `ddeep.config.js` file
*/

let fs = require("fs");

let make_recovery = function (checkpoint:number) {

    setTimeout( async () => {
 
        let source = './ddeep_data';
        let paste = './recovery';
        let point = Date.now();

        await fs.cp(source, `${paste}/${point}`, { recursive: true }, (err:any) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log({success: `checkpoint '${point}' created!`});
        });

        make_recovery(checkpoint);

    }, checkpoint);

}

module.exports = make_recovery;