
const getAIClasses = require("./classes_model");

// Define the main policy schema
type policySchema = {
    "name": string,
    "operations": Array<string>,
    "type": "check" | "smart",
    "graph": Array<string>,
    "check": Function,
    "rules": Array<string>
}

async function processPolicy (policy:policySchema, data:any) {

    let res;

    if (typeof policy !== "object") return false;
    if (!data) data = {};

    let type = policy.type;
    let name = policy.name;
    let check = policy.check;
    
    if (!check || typeof check !== "function") 
        throw new Error(`Check action is invalid in policy ${name}`);

    if (type === "check" || !type) {

        let result:true|false = await check(data);

        res = result;

    }

    if (type === "smart") {

        if (!data) throw new Error(`The data to process is undefined in smart policy ${name}`);

        let classes = await getAIClasses(data);
        if (!classes || typeof classes !== "object") throw new Error("Unable to process data classes");

        let result:true|false = await check(classes);

        res = result;

    }

    return res;

}