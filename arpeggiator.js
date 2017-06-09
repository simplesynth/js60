// TODO rename all vars, methods, elements to arpeggiator
// TODO don't restart the arpeggiator unless it's already on
// TODO add directionality: up, down, up/down
// TODO add 'Input' to jquery var names
var arpeggiatorBaseFrequency = oscillatorNode.frequency.value;
var arpeggiatorCount = 1
var arpeggiatorSpeed = 1000
var arpeggiatorOctaves = 2
var arpeggiatorDirection = 'up'

var arpeggiator;

function startArpeggiator() {
  if (arpeggiatorDirection === 'up'){
    arpeggiator = upSequence();
  } else if (arpeggiatorDirection === 'down'){
    arpeggiator = downSequence();
  } else if (arpeggiatorDirection === 'up/down'){
    arpeggiator = upDownSequence();
  }
}

function stopArpeggiator(){
  if (arpeggiator) {
    oscillatorNode.frequency.value = arpeggiatorBaseFrequency;
    arpeggiatorCount = 1;
    clearInterval(arpeggiator);
  }
}

function upSequence(){
  interval = setInterval(function(){
      if ( arpeggiatorCount >= arpeggiatorOctaves) {
        oscillatorNode.frequency.value = arpeggiatorBaseFrequency;
        arpeggiatorCount = 1
      } else {
        console.log(arpeggiatorCount);
        oscillatorNode.frequency.value = arpeggiatorBaseFrequency * (arpeggiatorCount + 1)
        arpeggiatorCount += 1;
      };
    }, arpeggiatorSpeed);
  return interval;
}

function downSequence(){
  interval = setInterval(function(){
    if (arpeggiatorCount >= arpeggiatorOctaves){
      oscillatorNode.frequency.value = arpeggiatorBaseFrequency;
      arpeggiatorCount = 1;
    } else {
      console.log(arpeggiatorCount);
      oscillatorNode.frequency.value = arpeggiatorBaseFrequency / (arpeggiatorCount + 1);
      arpeggiatorCount += 1;
    }
  }, arpeggiatorSpeed);
  return interval;
}

function upDownSequence(){
  var multiplier = 1
  interval = setInterval(function(){
    if (arpeggiatorCount >= arpeggiatorOctaves){
      multiplier = -1;
      arpeggiatorCount += multiplier;
    } else if (arpeggiatorCount <= -arpeggiatorOctaves){
      multiplier = 1;
      arpeggiatorCount += multiplier;
    } else {
      oscillatorNode.frequency.value = arpeggiatorBaseFrequency * (arpeggiatorCount + multiplier)
      arpeggiatorCount += multiplier;
    }

    console.log(arpeggiatorCount);
  }, arpeggiatorSpeed);
  return interval;
}

$(document).ready(function(){
  // INPUTS
  $arpSpeed = $('#arpSpeed');
  $arpOctaves = $('#arpOctaves');
  $arpDirection = $('#arpDirection');

  // BUTTONS
  $arpStart = $('#arpStart');
  $arpStop = $('#arpStop');

  // LISTENERS
  $arpStart.on('click', function(e){
    e.preventDefault();
    startArpeggiator();
  });

  $arpStop.on('click', function(e){
    e.preventDefault();
    stopArpeggiator();
    stopSynth();
  });

  $arpSpeed.on('change', function(){
    arpeggiatorSpeed = $arpSpeed.val();
    // TODO don't start arpeggiator if it isn't currently running
    if (arpeggiator) {
      stopArpeggiator();
      startArpeggiator();
    }
  });

  $arpOctaves.on('change', function(){
    arpeggiatorOctaves = $arpOctaves.val();
    if(arpeggiator) {
      stopArpeggiator();
      startArpeggiator();
    }
  })

  $arpDirection.on('change', function(){
    arpeggiatorDirection = $arpDirection.val();
    if(arpeggiator) {
      stopArpeggiator();
      startArpeggiator();
    }
  })

  // INITIALIZE SLIDERS
  $arpSpeed.val(arpeggiatorSpeed);
  $arpOctaves.val(arpeggiatorOctaves);
  $arpDirection.val(arpeggiatorDirection)
});