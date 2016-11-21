/* prototype for modifying how things look */
function UI(current_word_div, current_typing_div) {
    this.current_word_div = current_word_div;
    this.current_typing_div = current_typing_div;
}

UI.prototype.right_char = function (c) {
    var text = new Text(c);
    this.current_typing_div.appendChild(text);
}

UI.prototype.wrong_char = function (c) {
}

UI.prototype.clear = function () {
    this.current_word_div.className = "empty";
    this.current_typing_div.className = "empty";
    
    while (this.current_word_div.firstChild) {
	this.current_word_div.removeChild(
	    this.current_word_div.firstChild)
    }
    while (this.current_typing_div.firstChild) {
	this.current_typing_div.removeChild(
	    this.current_typing_div.firstChild)
    }
}

UI.prototype.new_word = function (word) {
    var text = new Text(word);
    this.current_word_div.appendChild(text);
    this.current_word_div.className = "active";
    /* TODO pin to the right */
}


/* current state */
function Word(word, ui, finish) {
    this.word = word;
    this.remaining_word = word.split("");
    this.finish_fn = finish;
    this.ui = ui;
}

Word.prototype.handle_keypress = function (ev) {
    /* TODO keep track of timings */
    /* TODO should we allow typos? */
    /* TODO call wrong_char */
    if (String.fromCharCode(ev.charCode) == this.remaining_word[0]) {
	this.ui.right_char(this.remaining_word.shift());
	if (this.remaining_word.length == 0) {
	    this.finish();
	}
    }
}

Word.prototype.timeout = function () {
}


Word.prototype.start = function () {
    /* start listening to the mic */
    /* register keyboard callback */
    document.addEventListener('keypress', this.handle_keypress.bind(this));
    /* register timeout callback */
    /* render self. */
    this.ui.new_word(this.word);
}

Word.prototype.finish = function () {
    /* stop listening on the mic */
    /* kill the keyboard callback */
    /* kill the timeout callback */
    /* unrender self */
    this.ui.clear();
    /* call the callback! */
    this.finish_fn();
}

function main () {
    /* TODO: actually talk to a service */
    /* TODO: collect other data about hte user, i.e. if it's a phone */
    /* make sure current word div and current progress div are present.  */
    var words = ["def", "abc def ghi jkl mno pqr stu"];
    var ui = new UI(document.getElementById("current_word"),
		    document.getElementById("current_typing"));
    (function next_word () {
	var here = words.pop();
	if (here) {
	    var word = new Word(here, ui, next_word);
	    word.start();
	} else {
	    /* TODO: show something to the user. */
	    console.log("!!! all done.\n");
	}
    })();
}

window.onload = main;
