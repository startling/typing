/* current state */
function Phrase(phrase, ui, sound, finish) {
    this.phrase = phrase;
    this.remaining_phrase = phrase.split("");
    this.finish_fn = finish;
    this.ui = ui;
    this.sound = sound;
    /* all keypresses and when they're pressed */
    this.log = [];
    /* number of bad keys pressed */
    this.typos_total = 0;
    /* how many backspaces are needed to get this in a good state. */
    this.typos_current = 0;
    this.start_time = null;
    this.first_keypress_time = null;
}

Phrase.prototype.handle_keypress = function (ev) {
    /* bad hack :( */
    var code = "";
    if (ev.key.length == 1) {
	code = ev.key;
    }
    this.log.push({code: code,
		   key: ev.key,
		   when: (new Date().getTime()),
		   corect: code == this.remaining_phrase[0]});
    if (ev.key == "Backspace") {
	if (this.typos_current > 0) {
	    this.typos_current -= 1;
	    this.ui.backspace();
	} else  {
	    this.ui.wrong_char(code);
	}
    } else if (this.typos_current == 0 && code == this.remaining_phrase[0]) {
	if (!this.first_keypress_time) {
	    this.first_keypress_time = new Date().getTime();
	}
	this.ui.right_char(this.remaining_phrase.shift());
	if (this.remaining_phrase.length == 0) {
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

Phrase.prototype.start = function () {
    /* register keyboard callback */
    window.onkeydown = this.handle_keypress.bind(this);
    /* start listening to the mic */
    this.sound.record();
    /* render self. */
    this.start_time = new Date().getTime();
    this.ui.new_phrase(this.phrase);
}

Phrase.prototype.finish = function () {
    /* kill the keyboard callback */
    window.onkeydown = null;
    /* stop listening on the mic */
    var sound_data = this.sound.stop();
    /* unrender self */
    this.ui.clear();
    /* call the callback! */
    this.finish_fn({
	phrase: this.phrase,
	keypresses: this.log,
	typos: this.typos_total,
	start_time: this.start_time,
	first_keypress_time: this.first_keypress_time,
	sound_data: sound_data
    });
}

module.exports = Phrase;
