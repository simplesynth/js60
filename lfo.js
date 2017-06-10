// GLOBALS
var lfoAmplitude = 0;
var lfoFrequency = 100;
var lfoShape = 'square';
var lfoDestination = 'filter';
var lfoProcess;
var lfoCount = 0
var lfoBaseGain;
var lfoStarted;
var lfoBaseFilterFrequency;

function startLFO(){
  if (lfoDestination === "gain") {
    lfoBaseGain = gainNode.gain.value;
  } else {
    console.log('set base filter freq');
    lfoBaseFilterFrequency = filterNode.frequency.value;
  }

  lfoProcess = squareWave();
  lfoStarted = true;
}

function stopLFO(){
  clearInterval(lfoProcess);
  if (lfoBaseGain) {
    gainNode.gain.value = lfoBaseGain;
  }
  if(lfoBaseFilterFrequency){
    filterNode.frequency.value = lfoBaseFilterFrequency;
  }
  lfoStarted = false;
}

function restartLFO(){
  if (lfoStarted) {
    stopLFO();
    startLFO();
  }
}

function squareWave(){
  newProcess = setInterval(function(){
    // console.log(lfoCount);
    // console.log(gainNode.gain.value);
    if (lfoCount % 2 === 0) {
      if (lfoDestination === "gain") {

        gainNode.gain.value = lfoBaseGain - (lfoBaseGain * lfoAmplitude);
      } else {
        filterNode.frequency.value = lfoBaseFilterFrequency - (lfoBaseFilterFrequency * lfoAmplitude)
        console.log('filter modulated');
      }
      lfoCount = 0;
    } else {
      if (lfoDestination === 'gain') {
        gainNode.gain.value = lfoBaseGain;
      } else {
        filterNode.frequency.value = lfoBaseFilterFrequency;
      }
    }
    lfoCount += 1;
  }, lfoFrequency)
  return newProcess;
}

$(document).ready(function(){
  // INPUTS
  $lfoAmplitude = $('#lfoAmplitude');
  $lfoFrequency = $('#lfoFrequency');
  $lfoDestination = $('#lfoDestination');
  $lfoShape = $('#lfoShape');

  // SET UNPUTS
  $lfoAmplitude.val(lfoAmplitude);
  $lfoFrequency.val(lfoFrequency);
  $lfoShape.val(lfoShape);
  $lfoDestination.val(lfoDestination);

  // LISTENERS
  $lfoAmplitude.on('change', function(){
    lfoAmplitude = $lfoAmplitude.val();
    restartLFO();
  })

  $lfoFrequency.on('change', function(){
    lfoFrequency = $lfoFrequency.val();
    restartLFO();
  })

  $lfoDestination.on('change', function(){
    lfoDestination = $lfoDestination.val();
    restartLFO();
  })

  startLFO();
})