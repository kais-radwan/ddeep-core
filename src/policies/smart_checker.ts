
// Define a smart rule value. example: ["angry", ">0.5", false]
type smartRuleValue = [string, string, true|false];

// Smart checker will check AI generated classes and match them with the defined rules
export function smartChecker (data:any, rules:Array<any>) {

    // Define main vars
    let res;
    let ao = ["<", ">", "=", "!"];

    // Throw error if data is invalid as it should be an object
    if (!data || typeof data !== "object") throw new Error("Data is not valid in smart check");

    // Map over the rules and process them
    for (let rule in rules) {

        // Define the current rule value
        let ruleValue:smartRuleValue = rules[rule];

        if (!ruleValue || typeof ruleValue !== "object" || ruleValue.length !== 3) 
            throw new Error("Invalid rule in smart check");

        // Define rule properties
        let ruleLabel:string = ruleValue[0];
        let ruleFullScore:string = ruleValue[1];
        let ruleScore:number = Number(ruleFullScore.substring(1, 100));
        let ruleScoreOperator:string = ruleFullScore.substring(0, 1);
        let ruleRes:true|false = ruleValue[2];

        // Throw error if rule operator is not valid
        if (ao.indexOf(ruleScoreOperator) === -1)
            throw new Error(`Opeartor '${ruleScoreOperator}' is not valid in smart check`);

        // Get the label's score value from the data
        let ruleClassScore = data[ruleLabel];

        // Throw error if the rule label does not exist in data classes
        if (!ruleClassScore) 
            throw new Error
            (`Rule label '${ruleLabel}' is not valid. valid labels:${JSON.stringify(Object.keys(data))}`);

        // Process the rule operation
        if (ruleScoreOperator === "<" && Number(ruleClassScore) < Number(ruleScore)) res = ruleRes;
        if (ruleScoreOperator === ">" && Number(ruleClassScore) > Number(ruleScore)) res = ruleRes;
        if (ruleScoreOperator === "=" && Number(ruleClassScore) === Number(ruleScore)) res = ruleRes;
        if (ruleScoreOperator === "!" && Number(ruleClassScore) !== Number(ruleScore)) res = ruleRes;

    }

    if (res !== true && res !== false) 
        throw new Error("Error processing a smart check. you are not returning a valid true|false")

    // Return the final result
    return res;

}

module.exports = smartChecker;