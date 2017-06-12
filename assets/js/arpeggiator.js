class Arpeggiator {
  constructor(oscillator) {
    this._oscillator = oscillator;
    this._baseFreq = oscillator.frequency.value;
    this._count = 1
    this._speed = 1000
    this._octaves = 2
    this._direction = 'up'
    this._process = false;
  }

  // initializeSliders(){

  // }

  start() {
    // if not already running
    if (!this.isRunning()){
      this._baseFreq = this._oscillator.frequency.value;
      if (this._direction === 'up'){
        this._process = this.upSequence(this._oscillator);
      } else if (this._direction === 'down'){
        this._process = this.downSequence(this._oscillator);
      } else if (this._direction === 'up/down'){
        this._process = this.upDownSequence(this._oscillator);
      }
    }
  }

  stop(){
    if (this.isRunning()) {
      this._oscillator.frequency.value = this._baseFreq;
      clearInterval(this._process);
      this._count = 1;
      this._process = false;
    }
  }

  restart(){
    if (this.isRunning()) {
      this.stop();
      this.start();
    }
  }

  upSequence(){
    var self = this;
    var interval = setInterval(function(){
        if ( self._count >= self._octaves) {
          self._oscillator.frequency.value = self._baseFreq;
          self._count = 1
        } else {
          self._oscillator.frequency.value = self._baseFreq * (self._count + 1)
          self._count += 1;
        };
      }, this._speed);
    return interval;
  }

  downSequence(){
    var self = this;
    var interval = setInterval(function(){
      if (self._count >= self._octaves){
        self._oscillator.frequency.value = self._baseFreq;
        self._count = 1;
      } else {
        console.log(self._count);
        self._oscillator.frequency.value = self._baseFreq / (self._count + 1);
        self._count += 1;
      }
    }, this._speed);
    return interval;
  }

  upDownSequence(){
    var self = this;
    var multiplier = 1
    var interval = setInterval(function(){
      if (self._count >= self._octaves){
        multiplier = -1;
        self._count += multiplier;
      } else if (self._count <= -self._octaves){
        multiplier = 1;
        self._count += multiplier;
      } else {
        self._oscillator.frequency.value = self._baseFreq * (self._count + multiplier)
        self._count += multiplier;
      }
      console.log(self._count);
    }, this._speed);
    return interval;
  }

  isRunning() {
    // process is not false
    return (this._process !== false)
  }

  get baseFreq() {
    return this._baseFreq;
  }

  set speed(speed) {
    this._speed = speed;
    this.restart();
  }

  set octaves(octaves) {
    this._octaves = octaves;
    this.restart();
  }

  set direction(direction) {
    this._direction = direction;
    this.restart();
  }

  set baseFreq(frequency){
    this._baseFreq = frequency;
    this.restart();
  }

}
