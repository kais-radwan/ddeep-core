
var processPolicy = require("./processor.ts");

type policySchema = {
    "name": string,
    "operations": Array<string>,
    "type": "check" | "smart",
    "graph": Array<string>,
    "check": Function,
    "rules": Array<string>
}

// scan policies for a specific node path and operation and process valid policies
function scanPolicies (nodes:Array<string>, operation:string, policies:any, data:any, cb:Function) {

    // Define the res that will change and be returned later
    let res:any = true;
    let processedPolicies:Array<string> = [];
    var anyApplied:true|false = false;

    // Make policies an empty object if no policies exist
    (!policies) ? policies = {} : null;

    // Loop over policies and process them
    for (let policy in policies) {

        // Define the policy values
        let policyValue = policies[policy];
        let policyOperations = policyValue.operations;
        let policyNodes = policyValue.graph;

        // if the policiy's operation and current operation and the parent nodes match then process the nodes
        if (policyOperations.indexOf(operation) > -1 && policyNodes[0] === nodes[0]) {

            let isAppiled:true|false = false;
            let mappingNodes:Array<string> = [];

            mappingNodes = (nodes.length > policyNodes.length) ? nodes 
                : (nodes.length < policyNodes.length) ? policyNodes 
                : nodes;

            for (let node in mappingNodes) {

                let nodeValue = nodes[node];
                let polNodeValue = policyNodes[node];

                isAppiled = (!polNodeValue)
                ? true : (polNodeValue === nodeValue) ? true : false;

                // if the policy is found and does not match the operation node so the policy is not applied
                if (polNodeValue && polNodeValue !== nodeValue) break;

                (nodeValue === processedPolicies[node] && processedPolicies.length < mappingNodes.length)
                ? isAppiled = false : processedPolicies[node] = nodeValue;

            }

            (isAppiled === true) ? anyApplied = true : null;
            (isAppiled === true) ? perform(nodes, policyValue, data, cb) : null;

        }

    }

    (!anyApplied) ? cb() : null;

}

var perform = async (soul:any, policy:any, data:any, cb:Function) => {

    var res = await processPolicy(policy, data);

    // Throw error if res is not a valid (true || false)
    (res !== true && res !== false) ?
        console.error("Error processing policy. you are not returning a valid true|false as a check")
        : null;

    (res === true) ? cb() : null;

}

module.exports = scanPolicies;