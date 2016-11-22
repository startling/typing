var beefy = require('beefy');
var http = require('http');

http.createServer(beefy({
    cwd: "resources",
    entries: {
	'/typing.js': 'src/typing.js'
    },
    bundler: "./node_modules/browserify/bin/cmd.js",
    live: true,
    quiet: false,
})).listen(8080, "0.0.0.0");
