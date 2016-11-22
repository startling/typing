var UI = require("./ui.js");
var Sound = require("./sound.js");
var Phrase = require("./phrase.js");

function main () {
    /* TODO: collect other data about hte user, i.e. if it's a phone, referer? */
    /* make sure current phrase div and current progress div are present.  */
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
			    console.log("Recorded: ", data);
			    next_phrase();
			});
		    phrase.start();
		} else {
		    ui.finished();
		    console.log("!!! all done.\n");
		}
	    })();
	},
	function (err) {
	    /* TODO: display this to the user */
	    console.log("Can't record!");
	});
}

window.typing = {main: main};
