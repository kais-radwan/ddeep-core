/*
    This simply create a point of recovery evrey amount of time you set in your `ddeep.config.js` file
*/

var fs = require("fs");

var make_recovery = function (checkpoint:number) {

    setTimeout( async () => {
 
        var source = './ddeep_data';
        var paste = './recovery';
        var point = Date.now();

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