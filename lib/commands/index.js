const { exec } = require('child_process');
var C_EVENT = require('events');

var commander = new C_EVENT();

// Exit process
commander.on('exit', (args) => {
    if (!args[1]) args[1] = 1;
    process.exit(args[1]);
});

// list (peers)
commander.on('list', (type) => {
    
    if (type[1] === "peers") {
        console.log('\nconnected peers:');
        if (process.PEERS.length > 0) {
            for (let peer in process.PEERS) {
                console.log(`${process.PEERS[peer]._id} -> listening to: ${process.PEERS[peer].listeners}`);
            }
        }else {
            console.log("NULL");
        }
        console.log("\nRun 'peer PEER_ID' to show full peer info\n".yellow);
    }

});

// clear (console || peers)
commander.on('clear', (type) => {

    if (!type[1]) {
        console.clear();
    }

    else if (type[1] === "peers") {
        process.PEERS = [];
    }

});

// show peer details
commander.on('peer', (data) => {
    var peer;
    var id = data[1];
    var arg = data[2];
    process.PEERS.forEach(peer_data => {
        if (peer_data._id === id) { peer = peer_data; };
    });
    
    if (peer && arg) {
        console.log(peer[arg.replace("--", "")]);
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
        : console.log('storage can only be set to true or fasle'.red);
    
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

commander.on('exec', async (args) => {
    
    delete args[0];
    var ex = "";
    if (args.length < 1) return;
    
    args.forEach(arg => {
        if (arg) ex = ex + ` ${arg}`;
    })

    if (ex) await exec(ex, (error, output) => {
        if (error) {
            console.log(`\n${error}`.red);
            return;
        } else {
            console.log(`\n${output}`);
            return;
        }
    });

    return;

});



module.exports = commander;