/* prototype for modifying how things look */
function UI(current_phrase_div, current_typing_div) {
    this.current_phrase_div = current_phrase_div;
    this.current_typing_div = current_typing_div;
}

UI.prototype.right_char = function (c) {
    var text = new Text(c);
    this.current_typing_div.appendChild(text);
    this.current_typing_div.className = "active-good";
}

UI.prototype.wrong_char = function (c) {
    if (c) {
	var text = new Text(c);
	this.current_typing_div.appendChild(text);
    }
    this.current_typing_div.className = "active-bad";
}

UI.prototype.backspace = function () {
    if (this.current_typing_div.lastChild) {
	this.current_typing_div.removeChild(
	    this.current_typing_div.lastChild);
    }
}

UI.prototype.clear = function () {
    this.current_phrase_div.className = "empty";
    this.current_typing_div.className = "empty";
    while (this.current_phrase_div.firstChild) {
	this.current_phrase_div.removeChild(
	    this.current_phrase_div.firstChild)
    }
    while (this.current_typing_div.firstChild) {
	this.current_typing_div.removeChild(
	    this.current_typing_div.firstChild)
    }
}

UI.prototype.finished = function () {
    var text = new Text("that's it for now!");
    this.current_phrase_div.appendChild(text);
    this.current_phrase_div.className = "finished";
    this.current_typing_div.className = "finished";
}

UI.prototype.new_phrase = function (phrase) {
    var text = new Text(phrase);
    this.current_phrase_div.appendChild(text);
    this.current_phrase_div.className = "active";
    /* TODO pin to the right */
}

module.exports = UI;
