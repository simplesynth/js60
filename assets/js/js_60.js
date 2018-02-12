// oscillator:  maxValue: 22050 minValue: 0
// filter:  maxValue: 22050 minValue: 0
// resonance:  maxValue: 3.4028 minValue: -3.4028

// TODO toggle start/stop button display
// make sure the right AudioContext is created for browser
var clickingFreqInput = false;
var clickingFilterFreqInput = false;
var clickingGainInput = false;
var clickingSubGainInput = false;
var clickingSubOffsetInput = false;
var clickingSequencerSpeed = false;
var clickingSequencerNote = false;
var clickingAttackTime = false;
var clickingDelayTime = false;
var clickingSustainLevel = false;
var clickingLfoAmplitude = false;
var clickingLfoFrequency = false;
var clickingResonanceInput = false;
// var js60;

$(document).ready(function(){
  // window.rangetouch.set("thumbWidth",20)

  // INPUTS
  var $frequencyInput = $('input#frequencyInput');
  var $gainInput = $('input#gainInput');
  var $subGainInput = $('input#subGainInput');
  var $subOffsetInput = $('input#subOffsetInput');
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
  $frequencyInput.on('touchend mouseup', function(){ clickingFreqInput = false; hideValue(); })
  $frequencyInput.on('touchmove mousemove change', function(){
    // if synth is created and the value differs from the oscillator freq
    if (synthPresent() && clickingFreqInput === true) {
      js60.oscillatorBaseFreq = $frequencyInput.val();
      displayValue($frequencyInput.val(), 'Hz');
    }
  });

  $gainInput.on('touchstart mousedown', function(){ clickingGainInput = true; })
  $gainInput.on('touchend mouseup', function(){ clickingGainInput = false; hideValue(); })
  $gainInput.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingGainInput === true){
      js60.gain = $gainInput.val();
      displayValue($gainInput.val());
    }
  });

  $subGainInput.on('touchstart mousedown', function(){ clickingSubGainInput = true; })
  $subGainInput.on('touchend mouseup', function(){ clickingSubGainInput = false; hideValue(); })
  $subGainInput.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingSubGainInput === true){
      js60.subGain = $subGainInput.val();
      displayValue($subGainInput.val());
    }
  });

  $subOffsetInput.on('touchstart mousedown', function(){ clickingSubOffsetInput = true; })
  $subOffsetInput.on('touchend mouseup', function(){ clickingSubOffsetInput = false; hideValue(); })
  $subOffsetInput.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingSubOffsetInput === true){
      js60.subOffset = $subOffsetInput.val();
      displayValue($subOffsetInput.val());
    }
  });

  $shapeInput.on('change', function(){
    if (synthPresent()) {
      js60.oscillatorType = $shapeInput.val();
    }
  });

  $filterFreqInput.on('touchstart mousedown', function(){ clickingFilterFreqInput = true; })
  $filterFreqInput.on('touchend mouseup', function(){ clickingFilterFreqInput = false; hideValue(); })
  $filterFreqInput.on('touchmove mousemove change', function(){
    if (synthPresent() && clickingFilterFreqInput === true){
      js60.filterFreq = $filterFreqInput.val();
      displayValue($filterFreqInput.val(), 'Hz');
    }
  });

  $resonanceInput.on('touchstart mousedown', function(){ clickingResonanceInput = true; })
  $resonanceInput.on('touchend mouseup', function(){ clickingResonanceInput = false; hideValue(); })
  $resonanceInput.on('touchmove mousemove change', function(){
    if (synthPresent() && clickingResonanceInput === true){
      js60.resonance = $resonanceInput.val();
      displayValue($resonanceInput.val());
    }
  });

  $startButton.on('touchend click', function(e){
    e.preventDefault();
    // create Synth instance and initialize sliders if not yet created
    if (!synthPresent()) {
      js60 = new Synth();
      js60.initializeSliders($frequencyInput, $gainInput, $subGainInput, $subOffsetInput, $shapeInput, $filterFreqInput, $resonanceInput, $attackTime, $delayTime, $sustainLevel, $sequencerSpeed);
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
  $attackTime.on('touchstart mousedown', function(){ clickingAttackTime = true; })
  $attackTime.on('touchend mouseup', function(){ clickingAttackTime = false; hideValue(); })
  $attackTime.on('touchmove mousemove change', function(e){
    if(synthPresent() && clickingAttackTime === true){
      js60.envelope.attackTime = parseFloat($attackTime.val());
      displayValue(parseFloat($attackTime.val()), 'ms');
    }
  });

  $delayTime.on('touchstart mousedown', function(){ clickingDelayTime = true; })
  $delayTime.on('touchend mouseup', function(){ clickingDelayTime = false; hideValue(); })
  $delayTime.on('touchmove mousemove change', function(e){
    if(synthPresent() && clickingDelayTime === true){
      js60.envelope.delayTime = parseFloat($delayTime.val());
      displayValue(parseFloat($delayTime.val()), 'ms');
    }
  });

  $sustainLevel.on('touchstart mousedown', function(){ clickingSustainLevel = true; })
  $sustainLevel.on('touchend mouseup', function(){ clickingSustainLevel = false; hideValue(); })
  $sustainLevel.on('touchmove mousemove change', function(e){
    if(synthPresent() && clickingSustainLevel === true){
      js60.envelope.sustainLevel = parseFloat($sustainLevel.val());
      displayValue(parseFloat($sustainLevel.val()));
    }
  });

  // SEQUENCER LISTENERS
  $sequencerSpeed.on('touchstart mousedown', function(){ clickingSequencerSpeed = true; })
  $sequencerSpeed.on('touchend mouseup', function(){ clickingSequencerSpeed = false; hideValue(); })
  $sequencerSpeed.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingSequencerSpeed === true){
      js60.sequencer.speed = $sequencerSpeed.val();
      displayValue($sequencerSpeed.val(), 'ms');
    }
  });

  $sequencerRow.on('touchstart mousedown', $sequencerNote, function(){ clickingSequencerNote = true; })
  $sequencerRow.on('touchend mouseup', $sequencerNote, function(){ clickingSequencerNote = false; hideValue(); })
  $sequencerRow.on('touchmove mousemove change', $sequencerNote, function(e){
    if(synthPresent() && clickingSequencerNote === true){
      var index = parseInt(e.target.getAttribute('data-index'));
      var interval = parseInt(e.target.value);
      js60.sequencer.change_note_at(index, interval);
      $('.indicatorLight[data-index="'+index+'"]').removeClass('rest');
      displayValue(interval);
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

  //bind listeners for first sequencer note
  addNewNoteListeners(0);

    // LFO LISTENERS
  $lfoAmplitude.on('touchstart mousedown', function(){ clickingLfoAmplitude = true; })
  $lfoAmplitude.on('touchend mouseup', function(){ clickingLfoAmplitude = false; hideValue(); })
  $lfoAmplitude.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingLfoAmplitude === true){
      js60.lfo.amplitude = $lfoAmplitude.val();
      displayValue($lfoAmplitude.val());
    }
  });

  $lfoFrequency.on('touchstart mousedown', function(){ clickingLfoFrequency = true; })
  $lfoFrequency.on('touchend mouseup', function(){ clickingLfoFrequency = false; hideValue(); })
  $lfoFrequency.on('touchmove mousemove change', function(){
    if(synthPresent() && clickingLfoFrequency === true){
      js60.lfo.frequency = $lfoFrequency.val();
      // displayValue($lfoFrequency.val());
    }
  });

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

function displayValue(value, unit = '') {
  var $valueContainer = $('#valueContainer');
  $valueContainer.html(value + unit);
  $valueContainer.show()
}

function hideValue() {
  var $valueContainer = $('#valueContainer');
  $valueContainer.hide();
}

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

