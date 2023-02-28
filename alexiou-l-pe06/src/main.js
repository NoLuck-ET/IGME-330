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

const drawParams = {
  showGradient  : true,
  showBars      : true,
  showCircles   : true,
  showNoise     : true,
  showInvert    : false,
  showEmboss    : false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "./media/New Adventure Theme.mp3"
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
  const fsButton = document.querySelector("#fsButton");
  
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  // B - hookup play button
  const playButton = document.querySelector("#playButton");

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
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

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
  let trackSelect = document.querySelector("#trackSelect");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // E - Hookup toggles
  document.querySelector("#gradientCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showGradient = e.target.checked;
  };
  document.querySelector("#barsCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showBars = e.target.checked;
  };
  document.querySelector("#circlesCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showCircles = e.target.checked;
  };
  document.querySelector("#noiseCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showNoise = e.target.checked;
  };
  document.querySelector("#invertCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showInvert = e.target.checked;
  };
  document.querySelector("#embossCB").onclick = (e) => {
    //showGradient = e.target.checked;
    drawParams.showEmboss = e.target.checked;
  };
	
}; // end setupUI

const loop = () => {
  
  requestAnimationFrame(loop);
  canvas.draw(drawParams);
  /* NOTE: This is temporary testing code that we will delete in Part II */
  // // 1) create a byte array (values of 0-255) to hold the audio data
  // // normally, we do this once when the program starts up, NOT every frame
  // let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
  
  // // 2) populate the array of audio data *by reference* (i.e. by its address)
  // audio.analyserNode.getByteFrequencyData(audioData);
  // //audio.analyserNode.getByteTimeDomainData(audioData); // waveform data
  
  // // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
  //   console.log(audioData);
    
  //   console.log("-----Audio Stats-----");
  //   let totalLoudness =  audioData.reduce((total,num) => total + num);
  //   let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
  //   let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
  //   let maxLoudness =  Math.max(...audioData); // ditto!
  //   // Now look at loudness in a specific bin
  //   // 22050 kHz divided by 128 bins = 172.23 kHz per bin
  //   // the 12th element in array represents loudness at 2.067 kHz
  //   let loudnessAt2K = audioData[11]; 
  //   console.log(`averageLoudness = ${averageLoudness}`);
  //   console.log(`minLoudness = ${minLoudness}`);
  //   console.log(`maxLoudness = ${maxLoudness}`);
  //   console.log(`loudnessAt2K = ${loudnessAt2K}`);
  //   console.log("---------------------");
};

export {init};