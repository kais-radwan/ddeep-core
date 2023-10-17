var extension;

// Add your own extensions here and use them in your code and policies using
module.exports = [

    // Add your extensions here
    {
        name: 'ext1',
        callback (...args) {
            console.log(args);
        }
    }

];

/*

    how to load extensions:

    var extensions = require('./lib/ext/require');
    extensions.load('extension_name');

    (change the require path based on your file's location. this works with policies perfectly)

*/