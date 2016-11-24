var http = require("http");
var cookie_handler = require("./cookie.js").handler;


var server = http.createServer(function (request, response) {
    /* todo real url parsing. */
    if (request.url == "/cookie") {
	var c = cookie_handler(
	    undefined, undefined,
	    function (_, body) {
		/*TODO: don't always 200? */
		response.writeHead(200, {"Set-Cookie": body["cookie"]});
		response.end(body.response || "");
	    });
    } else {
	response.writeHead(404);
	response.end("");
    }
});
server.listen(process.env.PORT, process.env.ADDRESS, function () {
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
		+ process.env.DOMAIN + ":"
		+ process.env.PORT + ". Have fun!");
});
