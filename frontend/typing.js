var UI = require("./ui.js");
var Sound = require("./sound.js");
var Phrase = require("./phrase.js");
var browser = require("bowser");

function metadata () {
    return {
	user_agent: navigator.userAgent,
	browser: browser._detect(navigator.userAgent),
	referer: document.referrer
    };
}

function warn (warning) {
    var container = document.getElementById("container");
    var p = document.createElement("p");
    var text = new Text(warning);
    p.appendChild(text);
    p.className = "warning";
    container.insertBefore(p, container.firstChild);
}

var phone_warning = "Note: we're not really looking for phone \
or tablet data. You're welcome to participate still! \
But we might not use it.";
var microphone_warning = "We won't be able to collect \
data, since we don't have access to your microphone. If you're interested, \
please give us access.";
var api_warning = "We can't communicate with the backend! Something's broken, sorry!";

function api_url(path) {
    var port_part = "";
    if ((process.env.API_PROTOCOL == "https"
	 && process.env.API_PORT != "443")
	|| (process.env.API_PROTOCOL == "http"
	    && process.env.PORT != "80")) {
	port_part += ":" + process.env.API_PORT;
    }
    return process.env.API_PROTOCOL + "://"
	+ process.env.API_DOMAIN
	+ port_part
	+ "/" + path;
}

function generate_cookie(then) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", then);
    req.addEventListener("error", function () { warn(api_warning); });
    req.open("GET", api_url("cookie"));
    req.send();
}

function fetch_phrases(then) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
	then(JSON.parse(this.responseText)["phrases"]);
    });
    req.addEventListener("error", function () { warn(api_warning); });
    req.open("GET", api_url("phrases"));
    req.send();
}

function main () {
    var meta = metadata();
    if (meta.tablet || meta.phone) {
	warn(phone_warning);
    }
    var ui = new UI(
	document.getElementById("current_phrase"),
	document.getElementById("current_typing"));
    generate_cookie(function () {
	var phrases = [];
	(new Sound()).start(
	    function (sound) {
		(function next_phrase () {
		    if (phrases.length == 0) {
			fetch_phrases(function (p) {
			    if (!p) {
				warn(api_warning);
			    } else if (p.length == 0) {
				ui.finish();
			    }
			    phrases = p;
			    next_phrase()
			});
		    } else {
			var here = phrases.pop();
			var phrase = new Phrase(
			    here, ui, sound,
			    function (data) {
				/* TODO: send this to the server  */
				console.log("Recorded: ", data,
					    "Metadata: ", meta);
				next_phrase();
			    });
			phrase.start();
		    }})();
	    },
	    function (err) {
		warn(microphone_warning);
	    });
    });
}

module.exports = main;
