
// Define a smart rule value. example: ["angry", ">0.5", false]
type Smartrule_value = [string, string, true|false];

// Smart checker will check AI generated classes and match them with the defined rules
export function smart_checker (data: any, rules: Array<any>) {

    // Define main variables
    let res;
    let ao = ["<", ">"];

    // Throw error if data is invalid as it should be an object
    if (!data || typeof data !== 'object') {
        console.error("Data is not valid in smart check");
        return undefined;
    }

    // Map over the rules and process them
    for (let rule in rules) {

        // Define the current rule value
        let rule_value: Smartrule_value = rules[rule];

        if (!rule_value || typeof rule_value !== 'object' || rule_value.length !== 3) {
            console.error("Invalid rule in smart check");
            return undefined;
        }

        // Define rule properties
        let rule_label: string = rule_value[0];
        let rule_full_score: string = rule_value[1];
        let rule_score: number = Number(rule_full_score.substring(1, 100));
        let rule_scoreOperator: string = rule_full_score.substring(0, 1);
        let rule_res: true|false = rule_value[2];

        // Throw error if rule operator is not valid
        if (ao.indexOf(rule_scoreOperator) === -1) {
            console.error(`Opeartor '${rule_scoreOperator}' is not valid in smart check`);
            return undefined;
        }

        // Get the label's score value from the data
        let ruleClassScore = data[rule_label];

        // Throw error if the rule label does not exist in data classes
        if (!ruleClassScore) {
            console.error(`Rule label '${rule_label}' is not valid. valid labels:${JSON.stringify(Object.keys(data))}`);
            return undefined;
        }

        // Process the rule operation
        let smaller = (rule_scoreOperator === '<' && Number(ruleClassScore) < Number(rule_score));
        let bigger = (rule_scoreOperator === ">" && Number(ruleClassScore) > Number(rule_score));
        
        if ( smaller || bigger ) {
            res = rule_res;
        }

        else {
            res = false;
        }

    }

    if (res !== true && res !== false) {
        console.error("Error processing a smart check. you are not returning a valid true|false");
        return undefined;
    }

    // Return the final result
    return res;

}

export default smart_checker;