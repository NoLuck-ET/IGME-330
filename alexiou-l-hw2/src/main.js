/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// parameters determined/updated in HTML, control variables for functions/actions.
const drawParams = {
  showBars       : true,
  showCircles    : true,
  showNoise      : false,
  showInvert     : false,
  showEmboss     : false,
  showHighshelf  : false,
  showLowshelf   : false,
  showDistortion : false
};

let distortionAmount = 0;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Stop a Gaben.mp3"
});

const init = () => {
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
};

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");
  
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  // B - hookup play button
  const playButton = document.querySelector("#play-button");

  // add .onclick event to button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
      // if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // our CSS will set to text to "Pause"
      //if track IS playing, pause it
    }else{
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no";
    }
  };

  // C - Hookup volume slider & label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");
  document.querySelector('#slider-distortion').value = distortionAmount;

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value  of label to match value of slider
    volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
  };

  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - Hookup track <select>
  let trackSelect = document.querySelector("#track-select");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  let audioSelect = document.querySelector('#audio-select');
  audioSelect.onchange = e => {
    let sample = new Uint8Array(audio.analyserNode.fftSize/2);
    if(e.target.value == 'Frequency'){
      audio.analyserNode.getByteFrequencyData(sample);
      
    }else{
      audio.analyserNode.getByteTimeDomainData(sample);
    }
  };

  // E - Hookup toggles
  document.querySelector("#bars-cb").onclick = (e) => {
    //showBars = e.target.checked;
    drawParams.showBars = e.target.checked;
  };
  document.querySelector("#circles-cb").onclick = (e) => {
    //showCircles = e.target.checked;
    drawParams.showCircles = e.target.checked;
  };
  document.querySelector("#noise-cb").onclick = (e) => {
    //showNoise = e.target.checked;
    drawParams.showNoise = e.target.checked;
  };
  document.querySelector("#invert-cb").onclick = (e) => {
    //showInvert = e.target.checked;
    drawParams.showInvert = e.target.checked;
  };
  document.querySelector("#emboss-cb").onclick = (e) => {
    //showEmboss = e.target.checked;
    drawParams.showEmboss = e.target.checked;
  };
  document.querySelector('#highshelf-cb').onchange = e => {
    drawParams.showHighshelf = e.target.checked;
    toggleHighshelf(); // turn on or turn off the filter, depending on the value of `highshelf`!
  };
  document.querySelector('#lowshelf-cb').onchange = e => {
    drawParams.showLowshelf = e.target.checked;
    toggleLowshelf(); // turn on or turn off the filter, depending on the value of `lowshelf`!
  };
  document.querySelector('#distortion-cb').onchange = e => {
    drawParams.showDistortion = e.target.checked;
    toggleDistortion(); // turn on or turn off the filter, depending on the value of `distortion`!
  };
  document.querySelector('#slider-distortion').onchange = e => {
    distortionAmount = Number(e.target.value);
    toggleDistortion();
  };
  
	toggleHighshelf(); // when the app starts up, turn on or turn off the filter, depending on the value of `highshelf`!
  toggleLowshelf(); // when the app starts up, turn on or turn off the filter, depending on the value of `lowshelf`!
  toggleDistortion();
}; // end setupUI

const loop = () => {
  setTimeout(loop,1000/60);
  //requestAnimationFrame(loop);
  canvas.draw(drawParams);
};

//toggle high-shelf sound altering
const toggleHighshelf = () => {
  if(drawParams.showHighshelf){
    audio.biquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
    audio.biquadFilter.gain.setValueAtTime(25, audio.audioCtx.currentTime);
  }else{
    audio.biquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
};

//toggle low-shelf sound altering
const toggleLowshelf = () => {
  if(drawParams.showLowshelf){
    audio.lowShelfBiquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.gain.setValueAtTime(15, audio.audioCtx.currentTime);
  }else{
    audio.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
};

// Toggles distortion, and sets sprite alpha based on input
const toggleDistortion = () => {
  if(drawParams.showDistortion){
    audio.distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
    audio.distortionFilter.curve = makeDistortionCurve(distortionAmount);
    canvas.fire.setTransparency(distortionAmount/100);
  }else{
    audio.distortionFilter.curve = null;
    canvas.fire.setTransparency(0);
  }
};

  // from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
const makeDistortionCurve = (amount=20) => {
  let n_samples = 256, curve = new Float32Array(n_samples);
  for (let i =0 ; i < n_samples; ++i ) {
      let x = i * 2 / n_samples - 1;
      curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
  }
  return curve;
};

export {init};