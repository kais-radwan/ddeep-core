let fs = require("node:fs");

const recover = async (timer: number): Promise<void> => {

    try {
        let source = './ddeep_data';
        let destination = `./recovery/${Date.now()}`;

        let data = Bun.file(source);
        let paste = Bun.file(destination);
        let value = await data.text();

        await Bun.write(paste, value);
        make_recovery(timer);
    }

    catch (err: any) {
        make_recovery(timer);
    }

}

const make_recovery = async (timer: number): Promise<void> => {

    await Bun.sleep(timer);
    recover(timer);

}

export default make_recovery;