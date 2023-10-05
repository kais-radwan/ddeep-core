"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartChecker = void 0;
// Smart checker will check AI generated classes and match them with the defined rules
function smartChecker(data, rules) {
    // Define main vars
    var res;
    var ao = ["<", ">"];
    // Throw error if data is invalid as it should be an object
    (!data || typeof data !== "object") ? console.error("Data is not valid in smart check") : null;
    // Map over the rules and process them
    for (var rule in rules) {
        // Define the current rule value
        var ruleValue = rules[rule];
        (!ruleValue || typeof ruleValue !== "object" || ruleValue.length !== 3) ?
            console.error("Invalid rule in smart check") : null;
        // Define rule properties
        var ruleLabel = ruleValue[0];
        var ruleFullScore = ruleValue[1];
        var ruleScore = Number(ruleFullScore.substring(1, 100));
        var ruleScoreOperator = ruleFullScore.substring(0, 1);
        var ruleRes = ruleValue[2];
        // Throw error if rule operator is not valid
        (ao.indexOf(ruleScoreOperator) === -1) ?
            console.error("Opeartor '".concat(ruleScoreOperator, "' is not valid in smart check")) : null;
        // Get the label's score value from the data
        var ruleClassScore = data[ruleLabel];
        // Throw error if the rule label does not exist in data classes
        (!ruleClassScore) ?
            console.error("Rule label '".concat(ruleLabel, "' is not valid. valid labels:").concat(JSON.stringify(Object.keys(data))))
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
exports.smartChecker = smartChecker;
module.exports = smartChecker;
