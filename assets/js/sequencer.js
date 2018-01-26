class Sequencer {
  constructor(oscillator, subOscillator) {
    this._sequence = [0]
    this._speed = 1000
    this._oscillator = oscillator;
    this._subOscillator = subOscillator;
    this._baseFreq = oscillator.frequency.value;
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

      var interval = self.noteToFrequency(self._sequence[self._count])
      self.oscillatorFreq = (self._baseFreq) + interval

      self._count += 1
    }, this._speed);
  }

  restart() {
    if (this._isRunning === true) {
      clearInterval(this._process);
      this._count = 0
      this._process = false
      this.start();
    }
  }

  add_note(note) {
    this._sequence.push(note);
  }

  change_note_at(index, note) {
    this._sequence[index] = note;
  }

  // add function to quitremove note

  noteToFrequency(note) {
    return 100 * note;
  }

  set speed(speed) {
    this._speed = speed;
    this.restart()
  }

  set oscillatorFreq(frequency) {
    this._oscillator.frequency.value = frequency;
    this._subOscillator.frequency.value = (this._oscillator.frequency.value / 2);
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
    this.restart();
  }
}