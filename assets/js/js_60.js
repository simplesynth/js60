// oscillator:  maxValue: 22050 minValue: 0
// filter:  maxValue: 22050 minValue: 0
// resonance:  maxValue: 3.4028 minValue: -3.4028

// TODO toggle start/stop button display
// make sure the right AudioContext is created for browser
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var clickingFreqInput = false;
var clickingFilterFreqInput = false;
var clickingGainInput = false;
// var js60;

$(document).ready(function(){
  // INPUTS
  var $frequencyInput = $('input#frequency_input');
  var $gainInput = $('input#gainInput');
  var $shapeInput = $('#shapeInput');
  var $filterFreqInput = $('input#filterFreqInput');
  var $resonanceInput = $('input#resonanceInput');

  var $arpSpeed = $('#arpSpeed');
  var $arpOctaves = $('#arpOctaves');
  var $arpDirection = $('#arpDirection');

  var $lfoAmplitude = $('#lfoAmplitude');
  var $lfoFrequency = $('#lfoFrequency');
  var $lfoDestination = $('#lfoDestination');
  var $lfoShape = $('#lfoShape');

  // BUTTONS
  var $startButton = $('#startButton');
  var $stopButton = $('#stopButton');

  var $arpStart = $('#arpStart');
  var $arpStop = $('#arpStop');

  // LISTENERS

  // fix for mousemove without click
  $frequencyInput.on('mousedown', function(){ clickingFreqInput = true; })
  $frequencyInput.on('mouseup', function(){ clickingFreqInput = false; })
  $frequencyInput.on('mousemove change', function(){
    // if synth is created and the value differs from the oscillator freq
    if (synthPresent() && clickingFreqInput === true) {
      console.log('freq changed');
      js60.oscillatorFreq = $frequencyInput.val();
      // arpeggiatorBaseFrequency = $frequencyInput.val();
    }
  });

  $gainInput.on('mousedown', function(){ clickingGainInput = true; })
  $gainInput.on('mouseup', function(){ clickingGainInput = false; })
  $gainInput.on('mousemove change', function(){
    if(synthPresent() && clickingGainInput === true){
      js60.gain = $gainInput.val();
    }
  });

  $shapeInput.on('change', function(){
    if (synthPresent()) {
      js60.oscillatorType = $shapeInput.val();
    }
  });

  $filterFreqInput.on('mousedown', function(){ clickingFilterFreqInput = true; })
  $filterFreqInput.on('mouseup', function(){ clickingFilterFreqInput = false; })
  $filterFreqInput.on('mousemove change', function(){
    if (synthPresent() && clickingFilterFreqInput === true){
      js60.filterFreq = $filterFreqInput.val();
    }
  });

  $resonanceInput.on('mousemove change', function(){
    if (synthPresent()) {
      js60.resonance = $resonanceInput.val();
    }
  });

  $startButton.on('touchend click', function(e){
    e.preventDefault();
    // create Synth instance and initialize sliders if not yet created
    if (!synthPresent()) {
      js60 = new Synth(window.AudioContext);
      js60.initializeSliders($frequencyInput, $gainInput, $shapeInput, $filterFreqInput, $resonanceInput);
    }
    js60.start();
  });

  $stopButton.on('touchend click', function(e){
    e.preventDefault();
    // stop synth if it has been created
    if (synthPresent()) {
      js60.stop();
    }
  });

    // ARPEGGIATOR LISTENERS
  $arpStart.on('click', function(e){
    e.preventDefault();
    if(synthPresent()){
      js60.startArpeggiator();
    }
  });

  $arpStop.on('click', function(e){
    e.preventDefault();
    if (synthPresent() && js60.arpeggiator.isRunning()){
      js60.stopArpeggiator();
    }
  });

  $arpSpeed.on('change', function(){
    if (synthPresent()){
      js60.arpeggiator.speed = $arpSpeed.val();
    }
  });

  $arpOctaves.on('change', function(){
    if (synthPresent()){
      js60.arpeggiator.octaves = $arpOctaves.val();
    }
  })

  $arpDirection.on('change', function(){
    if(synthPresent()){
      js60.arpeggiator.direction = $arpDirection.val();
    }
  })

    // LFO LISTENERS
  $lfoAmplitude.on('change', function(){
    if (synthPresent()){
      js60.lfo.amplitude = $lfoAmplitude.val();
    }
  })

  $lfoFrequency.on('change', function(){
    if (synthPresent()){
      js60.lfo.frequency = $lfoFrequency.val();
    }
  })

  $lfoDestination.on('change', function(){
    if (synthPresent()){
      js60.lfo.destination = $lfoDestination.val();
    }
  })

})

function synthPresent() {
  return typeof js60 !== 'undefined'
}

