class Envelope {
  constructor(destination, audioCtx) {
    this._destination = destination;
    this._audioCtx = audioCtx;
    // the max value
    this._destinationBaseValue = destination.value;
    // 0-1
    // this._amplitude = 0.5;
    // times in milliseconds
    this._attackTime = 1;
    this._delayTime = 1;
    // 0-1
    this._sustainLevel = 1;
    this._continue = false;
  }

  start() {
    this.destinationValue = 0;
    this._continue = true;
    this.attackCycle();
  }

  attackCycle(count = 0) {
    var self = this;
    // if (this.attackTime > 1) { this.destinationValue = 0 }
    setTimeout(function() {
      if (this._continue === false) {
        this.destinationValue = 0;
      }
      else if(self.attackTime === 1) { self.destinationValue = self._destinationBaseValue; self.delayCycle(); }
      else{
        // console.log('incrementing gain by: ' + parseFloat(self._destinationBaseValue) / parseFloat(self._attackTime))
        // console.log(self._destination.value)
        self._destination.value += parseFloat(self._destinationBaseValue) / parseFloat(self._attackTime);
        // console.log(self._destination.value)
        if(count < self._attackTime) { self.attackCycle(count + 1)}
        else  { self.delayCycle(); }
      }
    }, 1);
  }

  delayCycle(count = 0) {
    var self = this;
    setTimeout(function() {
      if (self._continue === false) {
        this.destinationValue = 0;
      }
      else if (self.delayTime === 1) { self.destinationValue = self._destinationBaseValue * self._sustainLevel;}
      else {
         // distance to target sustain level from current level
         // subtract the current gain level times the target sustain level from the current gain level
         // ex: 1 - (1 * 0.25) = 1 - 0.25 = 0.75 // slope from 1 to 0.75
         // ex: 0.5 - (0.5 * 0) = 0.5 - 0 = 0.5 // slope from 0.5 to 0
        var distanceToSustainLevel = parseFloat(self._destinationBaseValue) - (parseFloat(self._destinationBaseValue) * parseFloat(self._sustainLevel))
        // decrement the destination value by the distance to sustain level by the delay time (the amount of time in milliseconds to reach the target sustain level)
        // ex: 1 - (0.75 / 100 milliseconds) = 1 - 0.0075 = 0.9925
        // console.log('decrementing gain by: ' + distanceToSustainLevel / parseFloat(self._delayTime))
        self._destination.value -= distanceToSustainLevel / parseFloat(self._delayTime)
        // console.log(self._destination.value)
        if( count < self._delayTime) { self.delayCycle(count + 1) }
        // ensure that value is left at sustain level after delay cycle
        else { self._destination.value = self._destinationBaseValue * self._sustainLevel; }
      }

    }, 1);
  }

  stop() {
    this.destinationValue = 0;
    this._continue = false;
  }

  get attackTime() {
    return this._attackTime;
  }

  get delayTime() {
    return this._delayTime;
  }

  get sustainLevel() {
    return this._sustainLevel;
  }

  set attackTime(value) {
    this._attackTime = value;
  }

  set delayTime(value) {
    this._delayTime = value;
  }

  set sustainLevel(value) {
    this._sustainLevel = value;
  }

  set destinationValue(value) {
    this._destination.value = value
  }
}