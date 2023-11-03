let crypto = require('crypto');
let cache: any = {};
let tracked = new Set();
const opt = { max: 1000, age: 1000 * 9 };

interface DUP {
    check: Function,
    track: Function,
    destroy: Function,
    s: any,
    to: number | Timer | undefined,
    random: Function
}

const dup: DUP = {

    s: {},
    to: undefined,

    check: (id: string) => {

        if (cache[id]) {
            return cache[id];
        }

    },

    track: (id: string): string => {

        if (tracked.has(id)) {
            return id;
        }

        tracked.add(id);
        dup.s[id] = (+new Date());

        if (!dup.to) {
            dup.to = setTimeout(function () {
                for (const [id, time] of Object.entries(dup.s)) {
                    if (opt.age > ((+new Date()) - Number(time))) {
                        continue;
                    }

                    tracked.delete(id);
                    delete dup.s[id];
                }
                dup.to = undefined;
            }, opt.age);
        }

        return id;

    },

    destroy: (): void => {
        clearTimeout(dup.to);
        cache = {};
        tracked.clear();
    },

    random: (): number => {
        return (Date.now() * crypto.randomInt(0, 10000)) - crypto.randomInt(0, 199);
    }

}

export default dup;
