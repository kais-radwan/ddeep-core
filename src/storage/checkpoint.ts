let fs = require("node:fs");

let make_recovery = function (checkpoint_timer:number) {

    setTimeout( async () => {
 
        let source = './ddeep_data';
        let paste = './recovery';
        let point = Date.now();

        await fs.cp(source, `${paste}/${point}`, { recursive: true }, (err:any) => {
            if (err) {
              console.error(err);
              return undefined;
            }

            console.log({success: `checkpoint '${point}' created!`});
        });

        make_recovery(checkpoint_timer);

    }, checkpoint_timer);

}

export default make_recovery;