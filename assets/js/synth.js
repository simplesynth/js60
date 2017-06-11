class Synth {
  constructor(audioContext) {
    this._audioCtx = new audioContext();
    this._gainNode = this._audioCtx.createGain();
    this._filterNode = this._audioCtx.createBiquadFilter();
    this._oscillatorNode = this._audioCtx.createOscillator();
    this._connected = this.initialize();
  }

  initialize() {
    this._filterNode.connect(this._gainNode);
    this._gainNode.connect(this._audioCtx.destination);

    this._gainNode.gain.value = 0.5;

    this._filterNode.type = 'lowpass';
    this._filterNode.frequency.value = 22000;
    this._filterNode.Q.value = 3

    this._oscillatorNode.frequency.value = 110;
    this._oscillatorNode.type = 'square';

    this._oscillatorNode.start();

    return true;
  }

  // setSliders(){

  // }

  start() {
    this._oscillatorNode.connect(this._filterNode);
  }

  stop() {
    this._oscillatorNode.disconnect(this._filterNode);
  }

  // GETTERS
  get gain() {
    return this._gainNode.gain.value;
  }

  get filterFreq() {
    return this._filterNode.frequency.value;
  }

  get oscillatorFreq() {
    return this._oscillatorNode.frequency.value;
  }

  get connected(){
    return this._connected;
  }

  // SETTERS
  set gain(gain) {
    this._gainNode.gain.value = gain;
    // this._lfo.restart();
  }

  set oscillatorFreq(frequency) {
    this._oscillatorNode.frequency.value = frequency;
  }

  set oscillatorType(type) {
    this._oscillatorNode.type = type;
  }

  // set filterType(type) {
  //   this._filterNode.type = type;
  // }

  set filterFreq(frequency) {
    this._filterNode.frequency.value = frequency;
  }

  set resonance(resonance) {
    this._filterNode.Q.value = resonance;
  }

}