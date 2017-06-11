// oscillator:  maxValue: 22050 minValue: 0
// filter:  maxValue: 22050 minValue: 0
// resonance:  maxValue: 3.4028 minValue: -3.4028

// TODO toggle start/stop button display
// make sure the right AudioContext is created for browser
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// var js60;

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
  // $frequencyInput.val(oscillatorNode.frequency.value);
  // $gainInput.val(gainNode.gain.value);
  // $filterFreqInput.val(filterNode.frequency.value);
  // $resonanceInput.val(filterNode.Q.value);


  // // LISTENERS
  $frequencyInput.on('mousemove change', function(){
    // if synth is created and the value differs from the oscillator freq
    if (typeof js60 !== 'undefined' && $frequencyInput.val() !== js60.oscillatorFreq) {
      js60.oscillatorFreq = $frequencyInput.val();
      // arpeggiatorBaseFrequency = $frequencyInput.val();
    }
  });

  $gainInput.on('mousemove change', function(){
    if(synthPresent() && $gainInput.val() !== js60.gain){
      js60.gain = $gainInput.val();
    }
  });

  // $shapeInput.on('change', function(){
  //   oscillatorNode.type = $shapeInput.val();
  // });

  // $filterFreqInput.on('mousemove change', function(){
  //   filterNode.frequency.value  = $filterFreqInput.val();
  // });

  // $resonanceInput.on('mousemove change', function(){
  //   console.log('resonance: ' + $resonanceInput.val())
  //   filterNode.Q.value = $resonanceInput.val();
  // });

  $startButton.on('touchend click', function(e){
    e.preventDefault();
    // create Synth instance if not yet created
    if (!synthPresent()) {
      js60 = new Synth(window.AudioContext);
    }
    js60.start();
  });

  $stopButton.on('touchend click', function(e){
    // stop synth if it has been created
    if (synthPresent()) {
      js60.stop();
    }
  });

})

function synthPresent() {
  return typeof js60 !== 'undefined'
}

