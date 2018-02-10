// oscillator:  maxValue: 22050 minValue: 0
// filter:  maxValue: 22050 minValue: 0
// resonance:  maxValue: 3.4028 minValue: -3.4028

// TODO toggle start/stop button display
// make sure the right AudioContext is created for browser
var clickingFreqInput = false;
var clickingFilterFreqInput = false;
var clickingGainInput = false;
var clickingSubGainInput = false;
var clickingSequencerSpeed = false;
var clickingSequencerNote = false;
// var js60;

$(document).ready(function(){
  // window.rangetouch.set("thumbWidth",20)

  // INPUTS
  var $frequencyInput = $('input#frequencyInput');
  var $gainInput = $('input#gainInput');
  var $subGainInput = $('input#subGainInput');
  var $shapeInput = $('#shapeInput');
  var $filterFreqInput = $('input#filterFreqInput');
  var $resonanceInput = $('input#resonanceInput');

  var $attackTime = $('input#attackTime');
  var $delayTime = $('input#delayTime');
  var $sustainLevel = $('input#sustainLevel');
  // var $arpSpeed = $('#arpSpeed');
  // var $arpOctaves = $('#arpOctaves');
  // var $arpDirection = $('#arpDirection');

  var $lfoAmplitude = $('#lfoAmplitude');
  var $lfoFrequency = $('#lfoFrequency');
  var $lfoDestination = $('#lfoDestination');
  var $lfoShape = $('#lfoShape');

  // BUTTONS
  var $startButton = $('#startButton');
  var $stopButton = $('#stopButton');

  var $arpStart = $('#arpStart');
  var $arpStop = $('#arpStop');

  var $sequencerSpeed = $('#sequencerSpeed');
  var $sequencerNote = $('.sequencerNote');
  var $addNote = $('#addNote');
  var $sequencerRow = $('#sequencer-row');
  var $restButton = $('.restButton');
  var $indicatorLight = $('.indicatorLight');
  var $indicatorLightRest = $('.indicatorLight.rest');
  var $sequencerOpenButton = $('#sequencerOpenButton')

  // $addNote.toggle();

  // LISTENERS

  // fix for mousemove without click
  $frequencyInput.on('touchstart mousedown', function(){ clickingFreqInput = true; })
  $frequencyInput.on('touchend mouseup', function(){ clickingFreqInput = false;  })
  $frequencyInput.on('touchmove mousemove change', function(){
    // if synth is created and the value differs from the oscillator freq
    if (synthPresent() && clickingFreqInput === true) {
      js60.oscillatorBaseFreq = $frequencyInput.val();
    }
  });

  $gainInput.on('touchstart mousedown', function(){ clickingGainInput = true; })
  $gainInput.on('touchend mouseup', function(){ clickingGainInput = false; })
  $gainInput.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingGainInput === true){
      js60.gain = $gainInput.val();
    }
  });

  $subGainInput.on('touchstart mousedown', function(){ clickingSubGainInput = true; })
  $subGainInput.on('touchend mouseup', function(){ clickingSubGainInput = false; })
  $subGainInput.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingSubGainInput === true){
      js60.subGain = $subGainInput.val();
    }
  });

  $shapeInput.on('change', function(){
    if (synthPresent()) {
      js60.oscillatorType = $shapeInput.val();
    }
  });

  $filterFreqInput.on('touchstart mousedown', function(){ clickingFilterFreqInput = true; })
  $filterFreqInput.on('touchend mouseup', function(){ clickingFilterFreqInput = false; })
  $filterFreqInput.on('touchmove mousemove change', function(){
    if (synthPresent() && clickingFilterFreqInput === true){
      js60.filterFreq = $filterFreqInput.val();
    }
  });

  $resonanceInput.on('touchmove mousemove change', function(){
    if (synthPresent()) {
      js60.resonance = $resonanceInput.val();
    }
  });

  $startButton.on('touchend click', function(e){
    e.preventDefault();
    // create Synth instance and initialize sliders if not yet created
    if (!synthPresent()) {
      js60 = new Synth();
      js60.initializeSliders($frequencyInput, $gainInput, $subGainInput, $shapeInput, $filterFreqInput, $resonanceInput, $attackTime, $delayTime, $sustainLevel, $sequencerSpeed);
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

  // ENVELOPE LISTENERS
  $attackTime.on('change', function(e){
    e.preventDefault();
    js60.envelope.attackTime = parseFloat($attackTime.val());
  });

  $delayTime.on('change', function(e){
    e.preventDefault();
    js60.envelope.delayTime = parseFloat($delayTime.val());
  });

  $sustainLevel.on('change', function(e){
    e.preventDefault();
    js60.envelope.sustainLevel = parseFloat($sustainLevel.val());
  });

  // SEQUENCER LISTENERS
  $sequencerSpeed.on('touchstart mousedown', function(){ clickingSequencerSpeed = true; })
  $sequencerSpeed.on('touchend mouseup', function(){ clickingSequencerSpeed = false; })
  $sequencerSpeed.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingSequencerSpeed === true){
      js60.sequencer.speed = $sequencerSpeed.val();
    }
  });

  $sequencerRow.on('touchstart mousedown', $sequencerNote, function(){ clickingSequencerNote = true; })
  $sequencerRow.on('touchend mouseup', $sequencerNote, function(){ clickingSequencerNote = false; })
  $sequencerRow.on('touchmove mousemove change', $sequencerNote, function(e){
    if(synthPresent() && clickingSequencerNote === true){
      var index = parseInt(e.target.getAttribute('data-index'));
      var interval = parseInt(e.target.value);
      js60.sequencer.change_note_at(index, interval);
      $('.indicatorLight[data-index="'+index+'"]').removeClass('rest');
    }
  });

  $addNote.on('touchend click', function(e) {
    e.preventDefault();
    // get number of sequencer notes
    var nextIndex = js60.sequencer._sequence.length;
    js60.sequencer.add_note(0);
    // add new input with correct id, heading, and data-index attribute
    $sequencerRow.append('<div class="col-lg-2"><h4 class="indexNo">'+(nextIndex+1)+'</h4><span class= "indicatorLight" data-index="'+nextIndex+'"></span><input type="range" name="sequencerNote-'+nextIndex+'" class="sequencerNote" id="sequencerNote-'+nextIndex+'" data-index="'+nextIndex+'" min="-12" max="12" step="1"></div>');
    addNewNoteListeners(nextIndex)
  })

  addNewNoteListeners(0);

  // $sequencerOpenButton.on('touchend click', function(){
  //    $addNote.toggle();
  // })

  // $sequencerRow.on('click', $indicatorLight, function(e){
  //   // change note to 'x'
  //   var index = parseInt(e.target.getAttribute('data-index'));
  //   js60.sequencer.change_note_at(index, 'x')
  //   // add class to change indicator light color
  //   $(e.target).addClass('rest')
  // })



  //   // ARPEGGIATOR LISTENERS
  // $arpStart.on('click', function(e){
  //   e.preventDefault();
  //   if(synthPresent()){
  //     js60.startArpeggiator();
  //   }
  // });

  // $arpStop.on('click', function(e){
  //   e.preventDefault();
  //   if (synthPresent() && js60.arpeggiator.isRunning()){
  //     js60.stopArpeggiator();
  //   }
  // });

  // $arpSpeed.on('change', function(){
  //   if (synthPresent()){
  //     js60.arpeggiator.speed = $arpSpeed.val();
  //   }
  // });

  // $arpOctaves.on('change', function(){
  //   if (synthPresent()){
  //     js60.arpeggiator.octaves = $arpOctaves.val();
  //   }
  // })

  // $arpDirection.on('change', function(){
  //   if(synthPresent()){
  //     js60.arpeggiator.direction = $arpDirection.val();
  //   }
  // })

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

  $lfoShape.on('change', function(){
    if (synthPresent()){
      js60.lfo.shape = $lfoShape.val();
    }
  })

})

function addNewNoteListeners(index) {
  $('.indicatorLight[data-index="'+index+'"]').on('touchend click', function(){
    if ($(this).hasClass('rest')) {
      $(this).removeClass('rest');
      var note = $('#sequencerNote-'+index+'').val();
      js60.sequencer.change_note_at(index, note);
    }
    else {
      js60.sequencer.change_note_at(index, 'x')
      $(this).addClass('rest');
    }
  });
}

function synthPresent() {
  return typeof js60 !== 'undefined'
}

