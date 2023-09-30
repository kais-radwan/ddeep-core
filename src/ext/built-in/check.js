// Check a condition and return the result if achieved
function conditionCheck(condition) {
    // Define condition property and value
    var conditionProp = condition[0];
    var conditionValue = condition[1];
    return (conditionValue === true && conditionProp) ? true
    : (conditionValue === false && !conditionProp) ? true
    : (conditionProp === conditionValue) ? true
    : false;
}
module.exports = conditionCheck;