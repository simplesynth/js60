class Synth {
  constructor() {
    this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this._gainNode = this._audioCtx.createGain();
    this._filterNode = this._audioCtx.createBiquadFilter();
    this._preGain = this._audioCtx.createGain();
    // oscillator 1
    this._oscillatorNode = this._audioCtx.createOscillator();
    var bufferSize = 2 * this._audioCtx.sampleRate;
    this._noiseBuffer = this._audioCtx.createBuffer(1, bufferSize, this._audioCtx.sampleRate);
    var output = this._noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    this._whiteNoise = this._audioCtx.createBufferSource();

    this._oscillatorGain = this._audioCtx.createGain();
    // sub-oscillator
    this._subOscillatorNode = this._audioCtx.createOscillator();
    this._subOscillatorGain = this._audioCtx.createGain();
    this._subOffset = 0;

    this._sequencer = new Sequencer(this);

    this._initialized = this.initialize();
  }

  initialize() {
    this._filterNode.connect(this._gainNode);
    this._gainNode.connect(this._audioCtx.destination);
    // this._preGain.connect(this._filterNode);
    this._oscillatorGain.connect(this._preGain);
    this._subOscillatorGain.connect(this._preGain);
    // this._oscillatorNode.connect(this._oscillatorGain);
    this._whiteNoise.connect(this._oscillatorGain);
    this._subOscillatorNode.connect(this._subOscillatorGain)

    this._whiteNoise.buffer = this._noiseBuffer;
    this._whiteNoise.loop = true;
    this._whiteNoise.start(0);

    this._gainNode.gain.value = 0.5;
    this._preGain.gain.value = 1;
    this._oscillatorGain.gain.value = 1;
    this._subOscillatorGain.gain.value = 0;

    this._filterNode.type = 'lowpass';
    this._filterNode.frequency.value = 22000;
    this._filterNode.Q.value = 3

    this._oscillatorNode.frequency.value = 220;
    this._oscillatorNode.type = 'square';

    this._subOscillatorNode.frequency.value = (this._oscillatorNode.frequency.value / 2);

    this._oscillatorNode.start();
    this._subOscillatorNode.start();

    this._sequencer.baseFreq = this._oscillatorNode.frequency.value;
    this.envelope._destinationBaseValue = this._filterNode.frequency.value;

    // LFO must be initialized after the initial gain and filter values are set,
    // otherwise the base values will be incorrect
    this._lfo = new LFO(this);

    return true;
  }

  initializeSliders($frequencyInput, $gainInput, $subGainInput, $subOffsetInput, $shapeInput,
                    $filterFreqInput, $resonanceInput, $attackTime, $delayTime,
                    $sustainLevel, $sequencerSpeed)
  {
    $frequencyInput.val(this._oscillatorNode.frequency.value);
    $gainInput.val(this._gainNode.gain.value);
    $subGainInput.val(this._subOscillatorGain.gain.value);
    $subOffsetInput.val(this._subOffset);
    $shapeInput.val(this._oscillatorNode.type);
    $filterFreqInput.val(this._filterNode.frequency.value);
    $resonanceInput.val(this._filterNode.Q.value);
    $attackTime.val(this.envelope.attackTime);
    $delayTime.val(this.envelope.delayTime);
    $sustainLevel.val(this.envelope.sustainLevel);
    $sequencerSpeed.val(this.sequencer.speed)
  }

  start() {
    this._preGain.connect(this._filterNode);
    this.sequencer.start();
  }

  stop() {
    this._preGain.disconnect(this._filterNode);
    this.sequencer.stop();
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

  get initialized(){
    return this._initialized;
  }

  get lfo() {
    return this._lfo;
  }

  get envelope() {
    return this._sequencer._envelope
  }

  get sequencer() {
    return this._sequencer;
  }

  // SETTERS
  set gain(gain) {
    this._gainNode.gain.value = gain;
    this._lfo.baseGain = gain;
    // this._sequencer._envelope._destinationBaseValue = parseFloat(gain);
  }

  set subGain(gain) {
    this._subOscillatorGain.gain.value = gain;
  }

  set subOffset(offset) {
    this._subOffset = parseInt(offset);
    this._subOscillatorNode.frequency.setValueAtTime(this.calculateSubFreq(), 0);
  }

  // use this for input value changes
  set oscillatorBaseFreq(frequency) {
    frequency = parseFloat(frequency);
    this._oscillatorNode.frequency.setValueAtTime(frequency, 0);
    // set sub oscillator frequency
    this._subOscillatorNode.frequency.setValueAtTime(this.calculateSubFreq(), 0);
    // set sequencer baseFreq
    this._sequencer.baseFreq = frequency;
  }

  // use this for modulation sources
  set modulatedOscillatorFreq(frequency) {
    frequency = parseFloat(frequency);
    this._oscillatorNode.frequency.setValueAtTime(frequency, 0);
    // set sub oscillator frequency
    this._subOscillatorNode.frequency.setValueAtTime(this.calculateSubFreq(), 0);
  }

  set oscillatorType(type) {
    this._oscillatorNode.type = type;
  }

  set filterFreq(frequency) {
    this._filterNode.frequency.value = frequency;
    this._lfo.baseFilterFreq = frequency;
    this._sequencer._envelope._destinationBaseValue = parseFloat(frequency);
  }

  set resonance(resonance) {
    this._filterNode.Q.value = resonance;
  }

  calculateSubFreq() {
    var semitone = (this._subOffset < 0) ? (this._oscillatorNode.frequency.value / 24) : (this._oscillatorNode.frequency.value / 12);
    var offset_in_semitones = semitone * this._subOffset;
    return this._oscillatorNode.frequency.value + offset_in_semitones;
  }

}