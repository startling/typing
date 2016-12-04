var beefy = require('beefy');
var http = require('http');

http.createServer(beefy({
    cwd: "frontend/resources",
    entries: {
	'/main.js': 'frontend/main.js'
    },
    bundler: "./node_modules/browserify/bin/cmd.js",
    live: true,
    quiet: false,
    bundlerFlags: ["--debug", "-t", "envify", "-t", "uglifyify"]
})).listen(8080, "0.0.0.0");
