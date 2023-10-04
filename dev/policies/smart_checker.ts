
// Define a smart rule value. example: ["angry", ">0.5", false]
type smartRuleValue = [string, string, true|false];

// Smart checker will check AI generated classes and match them with the defined rules
export function smartChecker (data:any, rules:Array<any>) {

    // Define main vars
    let res;
    let ao = ["<", ">"];

    // Throw error if data is invalid as it should be an object
    (!data || typeof data !== "object") ? console.error("Data is not valid in smart check") : null;

    // Map over the rules and process them
    for (let rule in rules) {

        // Define the current rule value
        let ruleValue:smartRuleValue = rules[rule];

        (!ruleValue || typeof ruleValue !== "object" || ruleValue.length !== 3) ?
            console.error("Invalid rule in smart check") : null;

        // Define rule properties
        let ruleLabel:string = ruleValue[0];
        let ruleFullScore:string = ruleValue[1];
        let ruleScore:number = Number(ruleFullScore.substring(1, 100));
        let ruleScoreOperator:string = ruleFullScore.substring(0, 1);
        let ruleRes:true|false = ruleValue[2];

        // Throw error if rule operator is not valid
        (ao.indexOf(ruleScoreOperator) === -1) ?
            console.error(`Opeartor '${ruleScoreOperator}' is not valid in smart check`) : null;

        // Get the label's score value from the data
        let ruleClassScore = data[ruleLabel];

        // Throw error if the rule label does not exist in data classes
        (!ruleClassScore) ?
            console.error
            (`Rule label '${ruleLabel}' is not valid. valid labels:${JSON.stringify(Object.keys(data))}`)
            : null;

        // Process the rule operation
        (ruleScoreOperator === "<" && Number(ruleClassScore) < Number(ruleScore)) ? res = ruleScore
        : (ruleScoreOperator === ">" && Number(ruleClassScore) > Number(ruleScore)) ? res = ruleRes
        : null;

    }

    (res !== true && res !== false) ?
        console.error("Error processing a smart check. you are not returning a valid true|false") : null;

    // Return the final result
    return res;

}

module.exports = smartChecker;