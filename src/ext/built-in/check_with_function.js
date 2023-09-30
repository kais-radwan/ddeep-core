// Check a condition and run a function if the condition is achieved
function conditionCheckWithAction(condition, action, args) {
    // Define condition property and value
    var conditionProp = condition[0];
    var conditionValue = condition[1];
    (conditionValue === true && conditionProp) ? action(args)
    : (conditionValue === false && !conditionProp) ? action(args)
    : (conditionProp === conditionValue) ? action(args)
    : null; 
}

module.exports = conditionCheckWithAction;