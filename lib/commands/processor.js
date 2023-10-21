const { exec } = require('child_process');
var C_EVENT = require('events');

var commander = new C_EVENT();

// Exit process
commander.on('exit', (args) => {
    if (!args[1]) args[1] = 1;
    process.exit(args[1]);
});

// list (peers/listeners)
commander.on('list', (type) => {

    if (type[1] === "peers") {
        console.log('\nconnected peers:');
        if (Object.keys(process.PEERS).length > 0) {
            for (let peer in process.PEERS) {
                console.log(`_id: ${process.PEERS[peer]._id}`);
            }
        }else {
            console.log("No peers connected".gray);
        }
        console.log("\nRun 'peer PEER_ID' to show all peer info\n".yellow);
    }

    if (type[1] === "listeners") {
        console.log('\nconnected listeners:');
        if (Object.keys(process.listeners).length > 0) {
            console.log(process.listeners);
            console.log('');
        } else {
            console.log("No listeners...\n".gray);
        }
        console.log("\nRun 'peer PEER_ID' to show all peer info\n".yellow);
    }

});

// clear (console || peers)
commander.on('clear', (type) => {

    if (!type[1]) {
        console.clear();
    }

    else if (type[1] === 'peers') {
        process.PEERS = [];
    }

    else if (type[1] === 'listeners') {
        process.listeners = {}
    }

    else {
        console.log(`'${type[1]}' is not a valid argument for 'clear'`.red);
    }

});

// show peer details
commander.on('peer', (data) => {
    var peer;
    var id = data[1];
    var arg = data[2];
    
    Object.keys(process.PEERS).forEach(key => {
        var peer_data = process.PEERS[key];
        if (peer_data._id === id) { peer = peer_data; };
    });
    
    if (peer && arg) {
        var info = peer;
        arg.split('.').forEach(a => {
            if (!info) {
                console.log(`'${arg}' is not a valid key in the '${id}' peer`);
            }
            info = peer[a];
        })
        if (!info) {
            console.log(`'${arg}' is not a valid key in '${id}'`.red);
        } else {
            console.log(info);
        }
    }

    else if (peer && !arg) {
        console.log(peer);
    }
    
    else {
        console.log(`peer '${id}' not found`.red);
    }
});

commander.on('info', (type) => {

    if (!type[1]) {
        console.log("port -> ".yellow, `${process.port}`.gray);
        console.log("storage -> ".yellow, `${process.storage}`.gray);
        console.log("checkpoint -> ".yellow, `${process.checkpoint}`.gray, "\n");
    }

    if (type[1] === "storage") {
        console.log("storage -> ".yellow, `${process.storage}`.gray);
    }

    if (type[1] === "port") {
        console.log("port -> ".yellow, `${process.port}`.gray);
    }

    if (type[1] === "checkpoint") {
        console.log("checkpoint -> ".yellow, `${process.checkpoint}`.gray);
    }

});

commander.on('set', (args) => {

    if (args[1] === "storage") {
    
        (args[2] === 'true') ? process.storage = true
        : (args[2] === 'false') ? process.storage = false
        : console.log('storage can only be set to true or false'.red);

    }

    if (args[1] === "checkpoint") {
        process.checkpoint = Number(args[1]);
    }

});

commander.on('run', (args) => {
    
    delete args[0];
    var ex = "";
    
    if (args.length > 0) {
        args.forEach(arg => {
            if (arg) ex = ex + ` ${arg}`;
        })
        var func = new Function(ex);
        func();
    }

})

module.exports = commander;