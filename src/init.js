
const fs = require("fs");

module.exports = () => {

    var config = {
        port: 9999,
        storage: true,
    }

    var policiesConf = `module.exports = [// your policies go here];`;

	fs.writeFile("ddeep.config.json", JSON.stringify(config, null, 4), (err) => {

        if (err) { console.log(err); process.exit() };
		
        if (!err) console.log("\x1b[32m[+]\x1b[0m Done\n");
		if (!err) console.log(JSON.stringify(config, null, 4));

	});

    fs.writeFile("policies.config.js", JSON.stringify(config, null, 4), (err) => {

        if (err) { console.log(err); process.exit() };
		
        if (!err) console.log("\x1b[32m[+]\x1b[0m Done\n");
		if (!err) console.log(JSON.stringify(config, null, 4));

	});

}
