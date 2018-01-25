class Sequencer {
  constructor(oscillator, subOscillator) {
    this._sequence = [0]
    this._speed = 1000
    this._oscillator = oscillator;
    this._subOscillator = subOscillator;
    this._baseFreq = oscillator.frequency.value;
    this._process = false
    this._count = 0
  }

  start() {
    var self = this;
    this._process = setInterval(function(){
      if (self._count > self._sequence.length - 1) { console.log('reset count'); self._count = 0}

      self.oscillatorFreq = self._baseFreq + self.note_to_frequency(self._sequence[self._count])
      self._count += 1

    }, this._speed);
  }

  restart() {
    clearInterval(this._process);
    this._count = 0
    this._process = false
    this.start();
  }

  add_note(note) {
    this._sequence.push(note);
  }

  change_note_at(index, note) {
    this._sequence[index] = note;
  }

  // add function to quitremove note

  note_to_frequency(note) {
    console.log('note: ' + note);
    return 100 * note;
  }

  set speed(speed) {
    this._speed = speed;
    this.restart()
  }

  set oscillatorFreq(frequency) {
    console.log(frequency);
    this._oscillator.frequency.value = frequency;
    this._subOscillator.frequency.value = (this._oscillator.frequency.value / 2);
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
    this.restart();
  }
}