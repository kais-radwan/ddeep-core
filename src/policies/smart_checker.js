"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartChecker = void 0;
// Smart checker will check AI generated classes and match them with the defined rules
function smartChecker(data, rules) {
    // Define main vars
    var res;
    var ao = ["<", ">"];
    // Throw error if data is invalid as it should be an object
    if (!data || typeof data !== "object")
        throw new Error("Data is not valid in smart check");
    // Map over the rules and process them
    for (var rule in rules) {
        // Define the current rule value
        var ruleValue = rules[rule];
        if (!ruleValue || typeof ruleValue !== "object" || ruleValue.length !== 3)
            throw new Error("Invalid rule in smart check");
        // Define rule properties
        var ruleLabel = ruleValue[0];
        var ruleFullScore = ruleValue[1];
        var ruleScore = Number(ruleFullScore.substring(1, 100));
        var ruleScoreOperator = ruleFullScore.substring(0, 1);
        var ruleRes = ruleValue[2];
        // Throw error if rule operator is not valid
        if (ao.indexOf(ruleScoreOperator) === -1)
            throw new Error("Opeartor '".concat(ruleScoreOperator, "' is not valid in smart check"));
        // Get the label's score value from the data
        var ruleClassScore = data[ruleLabel];
        // Throw error if the rule label does not exist in data classes
        if (!ruleClassScore)
            throw new Error("Rule label '".concat(ruleLabel, "' is not valid. valid labels:").concat(JSON.stringify(Object.keys(data))));
        // Process the rule operation
        (ruleScoreOperator === "<" && Number(ruleClassScore) < Number(ruleScore)) ? res = ruleScore
            : (ruleScoreOperator === ">" && Number(ruleClassScore) > Number(ruleScore)) ? res = ruleRes
                : null;
    }
    if (res !== true && res !== false)
        throw new Error("Error processing a smart check. you are not returning a valid true|false");
    // Return the final result
    return res;
}
exports.smartChecker = smartChecker;
module.exports = smartChecker;
