let _processPolicy = require("./processor.ts");
let policies = require('../../policies.config');
let _policies_builder = require('./policies_builder');
policies = _policies_builder(policies);

// scan policies for a specific node path and operation and process valid policies
function _scanPolicies (graph:string, operation:string, data:any, cb:Function) {

    // Define the res that will change and be returned later
    let processedPolicies:Array<string> = [];
    let anyApplied:true|false = false;
    let applied_policy:any;

    // Make policies an empty object if no policies exist
    if (!policies) {
        policies = {};
    }

    // get the scoped set of policies for the current operation type
    let scoped_policies = policies[operation];
    if (!scoped_policies) { return undefined };

    let nodes:Array<string> = [];
    let props:any;
    let dynamic_node:any;

    if (graph.includes('.')) {
        nodes = graph.split('.')[0].split('/');
        props = graph.split('.')[1];
    } else {
        nodes = graph.split('/');
    }

    nodes.forEach(node => {
        if (!dynamic_node){
            dynamic_node = node;
        }else {
            dynamic_node = `${dynamic_node}/${node}`;
        }
        if (scoped_policies[dynamic_node]){
            applied_policy = scoped_policies[dynamic_node];
        }
    });

    if (props) {
        dynamic_node = `${dynamic_node}.${props}`;
        if (scoped_policies[dynamic_node]){
            applied_policy = scoped_policies[dynamic_node];
        }
    }

    if (applied_policy) {
        perform(nodes, applied_policy, data, cb);
    }
    
    else if (!applied_policy) {
        cb();
    }

}

let perform = async (soul:any, policy:any, data:any, cb:Function) => {

    let res = await _processPolicy(policy, data);

    // Throw error if res is not a valid (true || false)

    if (res !== true && res !== false) {
        console.error("Error processing policy. you are not returning a valid true|false as a check");
        return undefined;
    }

    if (res === true) {
        cb();
    }

}

module.exports = _scanPolicies;