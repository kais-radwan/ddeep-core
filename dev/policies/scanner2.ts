var _processPolicy = require("./processor.ts");
var policies = require('../../policies.config');
var _policies_builder = require('./policies_builder');
policies = _policies_builder(policies);

// scan policies for a specific node path and operation and process valid policies
function _scanPolicies (graph:string, operation:string, data:any, cb:Function) {

    // Define the res that will change and be returned later
    let processedPolicies:Array<string> = [];
    var anyApplied:true|false = false;
    var applied_policy:any;

    // Make policies an empty object if no policies exist
    if (!policies) {
        policies = {};
    }

    // get the scoped set of policies for the current operation type
    var scoped_policies = policies[operation];
    if (!scoped_policies) { return };

    var nodes:Array<string> = [];
    var props:any;
    var dynamic_node:any;

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

var perform = async (soul:any, policy:any, data:any, cb:Function) => {

    var res = await _processPolicy(policy, data);

    // Throw error if res is not a valid (true || false)
    (res !== true && res !== false) ?
        console.error("Error processing policy. you are not returning a valid true|false as a check")
        : null;

    (res === true) ? cb() : null;

}

module.exports = _scanPolicies;