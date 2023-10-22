
const getAIClasses = require("./classes_model.ts");

// Define the main policy schema
type policySchema = {
    "name": string,
    "operations": Array<string>,
    "type": "check" | "smart",
    "graph": Array<string>,
    "check": Function,
    "rules": Array<string>
}

async function processPolicy (policy: policySchema, data: any) {

    if (typeof policy !== "object") {
        console.error('Illegal policy');
        return false;
    };

    if (!data) {
        data = {};
    }

    let type = policy.type;
    let name = policy.name;
    let check = policy.check;

    if (!check || typeof check !== "function") {
        console.error(`Check action is invalid in policy ${name}`);
        return undefined;
    }

    if (type === 'check') {
        return await check(data);
    }

    else if (type === "smart") {

        let classes = await getAIClasses(data);
        
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

module.exports = processPolicy;