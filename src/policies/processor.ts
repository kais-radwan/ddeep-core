
import AI from './classes_calssifier';
import { Policy } from './builder';

async function process_policy (policy: Policy, data: any) {

    if (typeof policy !== "object") {
        console.error('Illegal policy');
        return false;
    };

    if (!data) { data = {} };

    let type = policy.type;
    let check = policy.check;

    if (!check || typeof check !== "function") {
        console.error(`Check action is invalid in policy`);
        return undefined;
    }

    if (type === 'check') {
        return await check(data);
    }

    else if (type === "smart") {

        let classes = await AI(data);
        
        if (!classes || typeof classes !== "object") {
            console.error("Unable to process data classes");
            return undefined;
        }

        return await check(classes);

    }

    else {
        return undefined;
    }

}

export default process_policy;