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

    },

    {

        name: "demo",

        // callback: ddeep.on("read", ["people", "kais"], false, (...args) => {
        //     var instance = args[0];
        //     var data = args[1];
        //     console.log(data);
        // })

    }

];