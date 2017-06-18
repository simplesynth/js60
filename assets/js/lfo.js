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
      if (self._count % 2 === 0) {
        if (self._destination === "gain") {
          self._gainNode.gain.value = self._baseGain - (self._baseGain * self._amplitude);
        } else {
          self._filterNode.frequency.value = self._baseFilterFreq - (self._baseFilterFreq * self._amplitude)
        }
        self._count = 0;
      } else {
        if (self._destination === 'gain') {
          self._gainNode.gain.value = self._baseGain;
        } else {
          self._filterNode.frequency.value = self._baseFilterFreq;
        }
      }
      self._count += 1;
    }, this._frequency)
    return newProcess;
  }

  sineWave(){
    var self = this;
    // f(t) = amplitude * sin( period * t)
     var newProcess = setInterval(function(){
      if (self._count === self._frequency){
        self._count = 0;
      } else{
        if (self._destination === "gain") {
          self._gainNode.gain.value = self._baseGain - (self._baseGain * self._amplitude * Math.sin((1 / self._frequency) * self._count));
          // console.log(self._count);
          // console.log(self._gainNode.gain.value);
        } else {
          self._filterNode.frequency.value = self._baseFilterFreq - (self._baseFilterFreq * self._amplitude * Math.sin((1 / self._frequency) * self._count));
        }
      }
      self._count += 1
    }, this._frequency)
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



//   $this._shape.on('change', function(){
//     this._shape = $this._shape.val();
//     restartLFO();
//   })
