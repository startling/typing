var http = require("http");
var cookie = require("./cookie.js");
var phrases = require("./phrases.js");


var server = http.createServer(function (request, response) {
    console.log("[.] serving " + request.url + ".");
    /* todo real url parsing. */
    if (request.url == "/cookie") {
	cookie.handler(
	    undefined, undefined,
	    function (_, body) {
		/*TODO: don't always 200? */
		response.writeHead(200,
				   {"Access-Control-Allow-Origin": "*",
				    "Content-Type": "application/json",
				    "Set-Cookie": body["cookie"]});
		response.end(body.response || "");
	    });
    } else if (request.url == "/phrases") {
	phrases.handler(
	    undefined, undefined,
	    function (_, body) {
		/*TODO: don't always 200? */
		response.writeHead(200, {"Access-Control-Allow-Origin": "*",
					 "Content-Type": "application/json"});
		response.end(body.response || "");
	    });
    } else {
	response.writeHead(404);
	response.end("");
    }
});
server.listen(process.env.API_PORT, process.env.ADDRESS, function () {
    process.on('SIGINT', function() {
	console.log("[!] stopping the server.");
	server.close(function () {
	    console.log("[!] exiting.");
	    process.exit(0);
	});
	/* set a timeout since this is unreliable */
	setTimeout(function () {
	    console.log("[!] timed out!\n")
	    process.exit(0);
	}, 500);
    });
    console.log("[!] serving on "
		+ process.env.API_DOMAIN + ":"
		+ process.env.API_PORT + ". Have fun!");
});
