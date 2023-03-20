// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, audioData, sourceNode, analyserNode, gainNode, biquadFilter, lowShelfBiquadFilter, distortionFilter, osc;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain        :   .5,
    numSamples  :   256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
//let audioData = new Uint8Array(DEFAULTS.numSamples/2);
//

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = () => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio(); // document.querySelector("audio");

    // 3 - have it point at a sound file
    loadSoundFile("./media/Stop a Gaben.mp3"); // loadSoundFile(filepath); 

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";
    // biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    // biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);

    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "lowshelf";
	
    distortionFilter = audioCtx.createWaveShaper();
    distortionFilter.type = "distortion";
    

    // 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser();// note the UK spelling of "Analyser"
    analyserNode.minDecibels = -100;
    analyserNode.maxDecibels = -10;
    analyserNode.smoothingTimeConstant = 0.85;
    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.

    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */ 

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    osc = audioCtx.createOscillator();
    osc.frequency.value = 440;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(distortionFilter);
    distortionFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

const loadSoundFile = (filepath) => {
    element.src = filepath;
};

const playCurrentSound = () => {
    element.play();
};

const pauseCurrentSound = () => {
    element.pause();
};

const setVolume = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
};

// Addapted from online instructions with permission of author: Chris Wilson || Namely used for the autoCorrelate function
// ============================================================================================================================================================================================
const getNote = () => {
    let bufferLength = analyserNode.fftSize;
    let buffer = new Float32Array(bufferLength);
    analyserNode.getFloatTimeDomainData(buffer);
    let autoCorrelateValue = autoCorrelate(buffer, audioCtx.sampleRate);

    // Handle rounding
    let valueToDisplay = autoCorrelateValue;

    //console.log(`valueToDisplay : ${valueToDisplay}`);
    return valueToDisplay
};


// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
const autoCorrelate = (buffer, sampleRate) => {
    // Perform a quick root-mean-square to see if we have enough signal
    let SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
        let val = buffer[i];
        sumOfSquares += val * val;
    }
    let rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
        return -1;
    }

    // Find a range in the buffer where the values are below a given threshold.
    let r1 = 0;
    let r2 = SIZE - 1;
    let threshold = 0.2;

    // Walk up for r1
    for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
    }
    }

    // Walk down for r2
    for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
    }
    }

    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length

    // Create a new array of the sums of offsets to do the autocorrelation
    let c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
    }
    }

    // Find the last index where that value is greater than the next one (the dip)
    let d = 0;
    while (c[d] > c[d+1]) {
    d++;
    }

    // Iterate from that index through the end and find the maximum sum
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
    if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
    }
    }

    let T0 = maxIndex;

    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    let x1 = c[T0 - 1];
    let x2 = c[T0];
    let x3 = c[T0 + 1]

    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2
    if (a) {
    T0 = T0 - b / (2 * a);
    }

    return sampleRate/T0;
};
// ============================================================================================================================================================================================

export {audioCtx, getNote, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, biquadFilter, lowShelfBiquadFilter, distortionFilter,analyserNode};