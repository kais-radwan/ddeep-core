var POLICY = require('./dev/policies/policy_builder');

/*
    exntesions gives you the ability to load extensions to your peer's code and policies.
    you can add your own extensions to the 'extensions.config.js' file or use built-in extensions.
    Use exntesions.load(extension_name) to load an extension.
*/
// var extensions = require("./lib/ext/require");

module.exports = [
    
    // your policies goes here
    POLICY(
        'check', ['get'], 'people',
        (data) => {
            // return (data.name) ? true : false;
            return true;
        }
    )

];