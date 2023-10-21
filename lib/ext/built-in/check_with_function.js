// Check a condition and run a function if the condition is achieved
function conditionCheckWithAction(condition, action, args) {
    // Define condition property and value
    var conditionProp = condition[0];
    var conditionValue = condition[1];

    if (conditionValue === true && conditionProp) {
        action(args);
    }

    else if (conditionValue === false && !conditionProp) {
        action(args);
    }

    else if (conditionValue === conditionProp) {
        action(args);
    }

}

module.exports = conditionCheckWithAction;