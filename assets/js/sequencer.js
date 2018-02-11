class Sequencer {
  constructor(synth) {
    this._sequence = [0]
    this._speed = 1000
    this._synth = synth;
    this._oscillator = this._synth._oscillatorNode;
    this._subOscillator = this._synth._subOscillatorNode;
    this._baseFreq = this._oscillator.frequency.value;
    this._gain = this._synth._gainNode.gain;
    this._envelope = new Envelope(synth, this._gain);
    this._process = false
    this._count = 0
    this._isRunning = false
  }

  start() {
    this._isRunning = true
    var self = this;
    this._process = setInterval(function(){
      // go back to first note at the end of the sequence
      if (self._count > self._sequence.length - 1) { self._count = 0 }

      if(self._sequence[self._count] !== 'x') {
        self.playNote();
      }
      else{ self._gain.value = 0 }

      self._count += 1
    }, this._speed);
  }

  stop() {
    clearInterval(this._process);
  }

  playNote() {
    this.indicatorLightOff();
    // stop envelope cycle
    this._envelope.stop();
    var interval = this.semitoneToFreq(this._sequence[this._count])
    this._synth.modulatedOscillatorFreq = this._baseFreq + interval
    this.indicatorLightOn();
    // begin envelope cycle
    this._envelope.start();
  }

  restart() {
    if (this._isRunning === true) {
      clearInterval(this._process);
      this._count = 0
      this._process = false
      this.start();
    }
  }

  indicatorLightOn(){
    $('span.indicatorLight[data-index="'+this._count+'"]').css('background-color', '#d9534f');
  }

  indicatorLightOff(){
    $('span.indicatorLight').css('background-color', 'transparent');
  }

  add_note(note) {
    this._sequence.push(note);
  }

  change_note_at(index, note) {
    this._sequence[index] = note;
  }

  // add function to remove note

  semitoneToFreq(note) {
    // distance to the next highest octave is equal to the base frequency (440 * 2 = 880, 880 - 440 = 440)
    // divide by 12 semitones to get frequency for 1 semitone
    var interval = (this._baseFreq / 12)
    if (note < 0) { interval = (this._baseFreq / 24) }
    return interval * note;
  }

  set speed(speed) {
    this._speed = speed;
    this.restart()
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
  }
}

// examples

// [12, "x", -4, 0, 7, 3, "x", 9, 3, "x", -3, 4]
