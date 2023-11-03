let fs = require("node:fs");

const recover = async function (timer: number): Promise<void> {

    try {

        let source = `${import.meta.dir}/../../ddeep_data`;
        let destination = `${import.meta.dir}/../../recovery`;
        let point = Date.now();

        await fs.cp(source, `${destination}/${point}`, { recursive: true }, (err:any) => {
            if (err) {
              console.error(err);
              return undefined;
            }
        });

        make_recovery(timer);

    }

    catch (err: any) {
        make_recovery(timer);
    }

}

const make_recovery = async (timer: number): Promise<void> => {

    setTimeout( () => {
        recover(timer);
    }, timer);

}

export default make_recovery;