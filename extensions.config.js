// Add your own extensions here and use them in your code and policies using `ddeepExt.load()`
module.exports = [

    // This is just a simple example to show you the basic schema of an extension
    {

        name: "logger",

        callback: (...args) => {
            var data = args[0];
            var type = args[1];
            (type === "error") ? console.error(data) : console.log(data);
        }

    }

];