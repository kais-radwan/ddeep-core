
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

async function processPolicy (policy:policySchema, data:any) {

    let res:true|false = false;

    if (typeof policy !== "object") return false;
    (!data) ? data = {} : null;

    let type = policy.type;
    let name = policy.name;
    let check = policy.check;

    if (!check || typeof check !== "function") 
        throw new Error(`Check action is invalid in policy ${name}`);

    (type === "check" || !type) ? res = await check(data) : null;

    if (type === "smart") {

        var classes = await getAIClasses(data);
        if (!classes || typeof classes !== "object") console.log("Unable to process data classes");

        var result:true|false = await check(classes);

        res = result;

    }

    return res;

}

module.exports = processPolicy;