module.exports = [
    {
        name: "check",
        callback: (args) => {
            var check = require("./check");
            return check(args);
        }
    },
    {
        name: "check_with_function",
        callback: (...args) => {
            var check_with_function = require("./check_with_function");
            return check_with_function(args[0], args[1], args[2]);
        }
    },
    {
        name: "smart_check",
        callback: (...args) => {
            var smartChecker = require("./smart_checker");
            return smartChecker(args[0], args[1]);
        }
    }
];