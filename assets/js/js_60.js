// oscillator:  maxValue: 22050 minValue: 0
// filter:  maxValue: 22050 minValue: 0
// resonance:  maxValue: 3.4028 minValue: -3.4028

// TODO toggle start/stop button display

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new window.AudioContext();
  var gainNode = audioCtx.createGain();
  var filterNode = audioCtx.createBiquadFilter();
  var oscillatorNode = audioCtx.createOscillator();
  var delayNode = audioCtx.createDelay(5.0);

  filterNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = 0.5

  filterNode.type = 'lowpass'
  filterNode.frequency.value = 22000
  filterNode.Q.value = 3

  oscillatorNode.frequency.value = 110
  oscillatorNode.type = 'square'

  oscillatorNode.start();

$(document).ready(function(){
  // INPUTS
  var $frequencyInput = $('input#frequency_input');
  var $gainInput = $('input#gainInput');
  var $shapeInput = $('#shapeInput');
  var $filterFreqInput = $('input#filterFreqInput');
  var $resonanceInput = $('input#resonanceInput');

  // BUTTONS
  var $startButton = $('#startButton');
  var $stopButton = $('#stopButton');

  // SET INITIAL SLIDER VALUES
  $frequencyInput.val(oscillatorNode.frequency.value);
  $gainInput.val(gainNode.gain.value);
  $filterFreqInput.val(filterNode.frequency.value);
  $resonanceInput.val(filterNode.Q.value);


  // LISTENERS
  $frequencyInput.on('mousemove change', function(){
    if (($frequencyInput.val() !== oscillatorNode.frequency.value) && ($frequencyInput.val() !== arpeggiatorBaseFrequency ) ){
      oscillatorNode.frequency.value = $frequencyInput.val();
      arpeggiatorBaseFrequency = $frequencyInput.val();
    }
  });

  $gainInput.on('mousemove change', function(){
    if (($gainInput.val() !== gainNode.gain.value) && ($gainInput.val() !== lfoBaseGain )){
      gainNode.gain.value = $gainInput.val();
      restartLFO();
    }
  });

  $shapeInput.on('change', function(){
    oscillatorNode.type = $shapeInput.val();
  });

  $filterFreqInput.on('mousemove change', function(){
    filterNode.frequency.value  = $filterFreqInput.val();
  });

  $resonanceInput.on('mousemove change', function(){
    console.log('resonance: ' + $resonanceInput.val())
    filterNode.Q.value = $resonanceInput.val();
  });

  $startButton.on('touchend click', function(e){
    e.preventDefault();
    startSynth();
  });

  $stopButton.on('touchend click', function(e){
    e.preventDefault();
    stopSynth();
  });

})

function startSynth(){
  oscillatorNode.connect(filterNode);
}

function stopSynth(){
  oscillatorNode.disconnect(filterNode);
}
