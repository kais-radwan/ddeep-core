import builder from './builder';
import policies_data from "../../policies.config";
import process_policy from "./processor";
import Permissions from './permissions';

let policies = builder.build(policies_data);

// scan policies for a specific node path and operation and process valid policies
function scan_policies (ws:any, graph: string, operation: string, data: any, cb: Function) {

    // Define the res that will change and be returned later
    let applied_policy:any;

    // Make policies an empty object if no policies exist
    if (!policies) {
        policies = {};
    }

    // get the scoped set of policies for the current operation type
    let scoped_policies = policies[operation];
    if (!scoped_policies) { return undefined };

    let nodes: Array<string> = [];
    let dynamic_node:any;

    if (graph.includes('.')) {
        nodes = graph.split('.')[0].split('/');
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

    if (applied_policy) {
        perform(ws, graph, applied_policy, data, cb);
    }
    
    else if (!applied_policy) {
        cb();
    }

}

let perform = async (ws: any, graph: string, policy: any, data: any, cb: Function) => {

    let res: true | false = await process_policy(policy, data);

    // Throw error if res is not a valid (true || false)

    if (res !== true && res !== false) {
        console.error("Error processing policy. you are not returning a valid true|false as a check");
        return undefined;
    }

    if (res === true) {
        cb();
    }

}

export default scan_policies;