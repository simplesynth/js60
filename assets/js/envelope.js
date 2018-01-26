class Envelope {
  constructor(destination) {
    this._destination = destination;
    // the max value
    this._destinationBaseValue = destination.value;
    // 0-1
    this._amplitude = 0.5;
    // times in milliseconds
    this._attackTime = 200;
    this._delayTime = 100;
    // 0-1
    this._sustainLevel = 0.5;
    this._continue = false;
  }

  start() {
    this._destination.value = 0;
    this._continue = true;
    this.attackCycle(0);
  }

  attackCycle(count) {
    var self = this;
    setTimeout(function() {
      if (this._continue === false) {
        self._destination.value = 0;
      }
      else{
        // console.log(self._destination.value)
        self._destination.value += parseInt(self._destinationBaseValue) / parseInt(self._attackTime);
        // console.log(self._destination.value)
        if(count < self._attackTime) { self.attackCycle(count + 1)}
        else  { self.delayCycle(0) }
      }
    }, 1);
  }

  delayCycle(count) {
    var self = this;
    setTimeout(function() {
      if (this._continue === false) { self._destination.value = 0; clearTimeout(this);}
      // console.log(self._destination.value)
      var distanceToSustainLevel = parseInt(self._destinationBaseValue) - (parseInt(self._destinationBaseValue) * parseInt(self._sustainLevel))
      self._destination.value -= distanceToSustainLevel / parseInt(self._delayTime)
      // console.log(self._destination.value)
      if(count < self._delayTime) { self.delayCycle(count + 1)}
    }, 1);
  }

  stop() {
    this._continue = false;
  }
}