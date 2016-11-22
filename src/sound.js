function Sound() {
    this.recorder = null
    this.data = [];
}

Sound.prototype.start = function (done, err) {
    var self = this;
    navigator.getUserMedia(
	{audio: true},
	function (lms) {
	    self.recorder = new MediaRecorder(lms);
	    self.recorder.ondataavailable = function (sound) {
		self.data.push(sound.data);
	    }
	    done(self)
	},
	err);
}

Sound.prototype.record = function () {
    this.recorder.start();
}

Sound.prototype.stop = function  () {
    this.recorder.stop();
    var data = this.data;
    this.data = [];
    return data;
}

module.exports = Sound;
