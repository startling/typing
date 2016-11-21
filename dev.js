var beefy = require('beefy');
var http = require('http');

http.createServer(beefy({
    cwd: __dirname,
    entries: ['src/typing.js'],
    live: true,
    quiet: false,
})).listen(8080, "0.0.0.0");
