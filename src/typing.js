/* prototype for modifying how things look */
function UI(current_word_div, current_typing_div) {
    this.current_word_div = current_word_div;
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

UI.prototype.finished = function () {
    var text = new Text("all done!");
    this.current_word_div.appendChild(text);
    this.current_word_div.className = "finished";
    this.current_typing_div.className = "finished";
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
    /* all keypresses and when they're pressed */
    this.log = [];
    /* number of bad keys pressed */
    this.typos_total = 0;
    /* how many backspaces are needed to get this in a good state. */
    this.typos_current = 0;
    this.start_time = null;
    this.first_keypress_time = null;
}

Word.prototype.handle_keypress = function (ev) {
    /* bad hack :( */
    var code = "";
    if (ev.key.length == 1) {
	code = ev.key;
    }
    this.log.push({code: code,
		   key: ev.key,
		   when: (new Date().getTime()),
		   corect: code == this.remaining_word[0]});
    /* TODO avoid logging repeat characters? or what? */
    if (ev.key == "Backspace") {
	if (this.typos_current > 0) {
	    this.typos_current -= 1;
	    this.ui.backspace();
	} else  {
	    this.ui.wrong_char(code);
	}
    } else if (this.typos_current == 0 && code == this.remaining_word[0]) {
	this.first_keypress_time |= new Date().getTime();
	this.ui.right_char(this.remaining_word.shift());
	if (this.remaining_word.length == 0) {
	    /* TODO: send this */
	    this.finish();
	}
    } else {
	/* make sure it's a char */
	if (code.length > 0) {
 	    this.typos_total += 1;
 	    this.typos_current += 1;
	    this.ui.wrong_char(code);
	}
    }
}

Word.prototype.start = function () {
    /* TODO start listening to the mic */
    /* register keyboard callback */
    window.onkeydown = this.handle_keypress.bind(this);
    /* render self. */
    this.start_time = new Date().getTime();
    this.ui.new_word(this.word);
}

Word.prototype.finish = function () {
    /* TODO stop listening on the mic */
    /* kill the keyboard callback */
    window.onkeydown = null;
    /* unrender self */
    this.ui.clear();
    /* call the callback! */
    this.finish_fn();
}

function main () {
    /* TODO: collect other data about hte user, i.e. if it's a phone, referer? */
    /* make sure current word div and current progress div are present.  */
    var words = ["def", "abc"];
    var ui = new UI(document.getElementById("current_word"),
		    document.getElementById("current_typing"));
    (function next_word () {
	var here = words.pop();
	if (here) {
	    var word = new Word(here, ui, next_word);
	    word.start();
	} else {
	    ui.finished();
	    console.log("!!! all done.\n");
	}
    })();
}

window.onload = main;
