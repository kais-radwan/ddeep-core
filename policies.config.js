
// ddeepExt gives you the ability to load extensions to your peer's code and policies
// you can add your own extensions to the 'extensions.config.js' file or use built-in extensions
// Use ddeepExt.load(extension_name: string) to load an extension
var ddeepExt = require("./src/ext/require");

var policies = [

    {
        name: "example_policy",
        operations: ["read", "write"],
        type: "check",
        graph: ["people", "kais"],

        check(args) {

            var instance = args.instance;
            var data = args.data;

            return (typeof instance === "object") ? true : false;

        }

    }

];

// console.log(policies[0].check({data: true}));

module.exports = policies;