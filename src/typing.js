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

function main () {
    var meta = metadata();
    if (meta.tablet || meta.phone) {
	warn(phone_warning);
    }
    (new Sound()).start(
	function (sound) {
	    var phrases = ["def", "abc"];
	    var ui = new UI(document.getElementById("current_phrase"),
			    document.getElementById("current_typing"));
	    (function next_phrase () {
		var here = phrases.pop();
		if (here) {
		    var phrase = new Phrase(
			here, ui, sound,
			function (data) {
			    /* TODO: send this to the server  */
			    console.log("Recorded: ", data,
					"Metadata: ", meta);
			    next_phrase();
			});
		    phrase.start();
		} else {
		    ui.finished();
		}
	    })();
	},
	function (err) {
	    warn(microphone_warning);
	});
}

window.typing = {main: main};
