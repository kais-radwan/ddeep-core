
const processPolicy = require("./processor");

type policySchema = {
    "name": string,
    "operations": Array<string>,
    "type": "check" | "smart",
    "graph": Array<string>,
    "check": Function,
    "rules": Array<string>
}

// scan policies for a specific node path and operation and process valid policies
export async function scanPolicies (nodes:Array<string>, operation:string, policies:any, data:any) {

    // Define the res that will change and be returned later
    let res:any = true;
    let processedPolicies:Array<string> = [];

    // Make policies an empty object if no policies exist
    if (!policies) policies = {};

    // Loop over policies and process them
    policies.forEach( async (policy:policySchema) => {

        // Define the policy values
        let policyOperations = policy.operations;
        let policyNodes = policy.graph;

        // if the policiy's operation and current operation and the parent nodes match then process the nodes
        if (policyOperations.indexOf(operation) > -1 && policyNodes[0] === nodes[0]) {

            let isAppiled:true|false = false;
            let mappingNodes:Array<string> = [];

            if (nodes.length > policyNodes.length) mappingNodes = nodes;
            if (nodes.length < policyNodes.length) mappingNodes = policyNodes;
            if (nodes.length === policyNodes.length) mappingNodes = nodes;

            for (let node in mappingNodes) {

                let nodeValue = nodes[node];
                let polNodeValue = policyNodes[node];

                // if the policy node is not found so the root of the current node is applied -> policy applied
                if (!polNodeValue) {
                    isAppiled = true;
                }

                // if the policy node match the operation node so the policy is applied
                else if (polNodeValue === nodeValue) {
                    isAppiled = true;
                }

                // if the policy is found and does not match the operation node so the policy is not applied
                else {
                    isAppiled = false;
                    break;
                }

                if (nodeValue === processedPolicies[node] && processedPolicies.length < mappingNodes.length) {
                    isAppiled = false;
                }

                else {
                    processedPolicies[node] = nodeValue;
                }

            }

            if (isAppiled === true) res = await processPolicy(policy, data);

        }

    })

    // Throw error if res is not a valid (true || false)
    if (res !== true && res !== false)
        throw new Error("Error processing policy. you are not returning a valid true|false as a check");

    // Return the result
    return res;

}

module.exports = scanPolicies;