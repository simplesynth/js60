// TODO remove started and check process
class LFO {
  constructor(gain, filter) {
    this._gainNode = gain;
    this._filterNode = filter;
    this._amplitude = 0;
    this._frequency = 100;
    this._shape = 'square';
    this._destination = 'gain';
    this._process;
    this._count = 0
    this._baseGain = this._gainNode.gain.value;
    this._baseFilterFreq = this._filterNode.frequency.value;
    this._started;
  }

  start(){
    if (this._destination === "gain") {
      this._baseGain = this._gainNode.gain.value;
    } else {
      this._baseFilterFreq = this._filterNode.frequency.value;
    }

    if (this._shape === "square"){
      this._process = this.squareWave();
    } else {
      this._process = this.sineWave();
    }
    this._started = true;
  }

  stop(){
    clearInterval(this._process);
    if (this._baseGain) {
      this._gainNode.gain.value = this._baseGain;
    }
    if(this._baseFilterFreq){
      this._filterNode.frequency.value = this._baseFilterFreq;
    }
    this._started = false;
    this._count = 0;
  }

  restart(){
    if (this.isRunning()) {
      this.stop();
      this.start();
    }
  }

  squareWave(){
    var self = this;
    var newProcess = setInterval(function(){
      if (self._destination === 'gain') {
        var square = new SquareWave(self._amplitude, self._baseGain, self._count)
        self._gainNode.gain.value = square.calculate();
      }
      else {
        var square = new SquareWave(self._amplitude, self._baseFilterFreq, self._count)
        self._filterNode.frequency.value = square.calculate();
      }
      self._count += 1;
    }, this._frequency)
    return newProcess;
  }

  sineWave(){
    var self = this;

    // f(x) = A sin(wt + p)
    var newProcess = setInterval(function(){
      if (self._destination === "gain") {
        var sine = new SineWave(self._frequency, self._amplitude, self._baseGain, 1, self._count)
        self._gainNode.gain.value = sine.calculate();
      } else {
        // set filter frequency
        var sine = new SineWave(self._frequency, self._amplitude, self._baseFilterFreq, self._filterNode.frequency.maxValue, self._count)
        self._filterNode.frequency.value = sine.calculate();
      }
    self._count += 1
    }, 1)
    return newProcess;
  }

  isRunning() {
    return (this._started !== false);
  }

  set amplitude(amplitude) {
    this._amplitude = amplitude;
    this.restart();
  }

  set frequency(frequency) {
    this._frequency = -frequency;
    this.restart();
  }

  set destination(destination) {
    this._destination = destination;
    this.restart();
  }

  set baseGain(gain) {
    this._baseGain = gain;
    if (this._destination === 'gain') {
      this.restart();
    }
  }

  set baseFilterFreq(frequency) {
    this._baseFilterFreq = frequency;
    if (this._destination === 'filter') {
      this.restart();
    }
  }

  set shape(shape) {
    this._shape = shape;
    this.restart();
  }
}

class SquareWave {
  constructor(amplitude, initialValue, count) {
    this._amplitude = amplitude;
    this._initialValue = initialValue;
    this._count = count;
  }

  calculate() {
    if (this._count % 2 == 0) { return this._initialValue - (this._initialValue * this._amplitude); }
    else { return this._initialValue; }
  }
}

class SineWave {
  constructor(frequency, amplitude, initialValue, highBound, count) {
    this._frequency = frequency;
    this._amplitude = amplitude * (highBound / 2);
    this._initialValue = initialValue;
    this._highBound = highBound;
    this._count = count;
  }

  calculate() {
    return this.withinBounds(this._initialValue + this._amplitude * Math.sin((1 / this._frequency) * this._count));
  }

  withinBounds(value) {
    if (value > this._highBound) { return this._highBound; }
    else if (value < 0 ) { return 0 }
    else { return value }
  }
}





//   $this._shape.on('change', function(){
//     this._shape = $this._shape.val();
//     restartLFO();
//   })
