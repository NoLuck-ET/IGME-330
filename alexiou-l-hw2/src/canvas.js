/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as loader from './loader.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

let images = [];
let rotation = 0; 
let gradList = ["#00001b","#00001b","#00001b","#121e33","#121e33","#314f67","#54869b","#7fc1cd","#99e0e4","#b5fffb", "#b5fffb", "#99e0e4", "#7fc1cd", "#54869b", "#314f67", "#121e33", "#121e33", "#00001b", "#00001b", "#00001b"];
//let gradList = ["#00001b","#121e33","#21354d","#314f67","#416a81","#54869b","#68a3b4","#7fc1cd","#99e0e4","#b5fffb", "#b5fffb", "#99e0e4", "#7fc1cd", "#68a3b4", "#54869b", "#416a81", "#314f67", "#21354d", "#121e33", "#00001b"];

let gradCount = 0;
let gradBool = false;

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom 
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0.05,color:"#00001b"},{percent:0.1,color:"#121e33"},{percent:0.15,color:"#21354d"}, {percent:0.2,color:"#314f67"},{percent:0.25,color:"#416a81"} ,{percent:0.3,color:"#54869b"}, {percent:0.35,color:"#68a3b4"}, {percent:0.4,color:"#7fc1cd"}, {percent:0.45,color:"#99e0e4"},{percent:0.5,color:"#b5fffb"},{percent:0.55,color:"#b5fffb"},{percent:0.6,color:"#99e0e4"},{percent:0.65,color:"#7fc1cd"},{percent:0.7,color:"#68a3b4"},{percent:0.75,color:"#54869b"},{percent:0.8,color:"#416a81"},{percent:0.85,color:"#314f67"},{percent:0.9,color:"#21354d"},{percent:0.95,color:"#121e33"},{percent:1,color:"#00001b"},]);
    // keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
};

const draw = (params={}) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    //analyserNode.getByteFrequencyData(audioData);
	// OR
	analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

	// 4 - draw bars
	/*if(params.showBars){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.50)`;
        ctx.strokeStyle = `rgba(0,0,0,0.50)`;
        // loop through the data and draw
        for(let i = 0; i < audioData.length; i++)
        {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,barHeight);
        }
        ctx.restore();
    }*/

	// 5 - draw circles
	/*if(params.showCircles){
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++)
        {
            //red-ish circles
            let percent = audioData[i] / 255;
            
            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255,111,111, 0.34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //blue-ish circles. Bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0,0,255,0.10 - percent/10.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //yellow-ish circles. Smaller
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, 0.5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }*/

    

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; // not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i < length; i += 4){ //----------------- PERSONAL NOTE: Too noisy
		// C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < 0.5){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
			data[i] = 90;// make the red channel slightly red
            data[i+1] = 75;// make the gren channel a tad green
            data[i+2] = 150;// make the blue channel very blue
		} // end if

        //invert?
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255-red;
            data[i+1] = 255-green;
            data[i+2] = 255-blue;
            //data[i+3] is the alpha, we're leaving that alone
        }// end if
	} // end for

    // note we are stepping through *each* sub-pixel
    if(params.showEmboss){ // emboss effect
        for(let i = 0; i < length; i++)
        {
            if(i%4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2*data[i] - data[i+4] - data[i + width * 4];
        }
    }
    
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData,0,0);


    // 7 - drawing images
    rotation += .003;
    images = loader.images;
    //ctx.drawImage(image, dx, dy, dWidth, dHeight); 
    // draw "from center"
    drawCelestialBody(0, -canvasHeight + 60, images[0], rotation, "#53676C");
    drawCelestialBody(0, canvasHeight - 60, images[1], rotation, "#FFC257");

    // 8 - establis gradient
    let temp = gradList[0];
    gradCount++;
    if(gradCount%60 == 1){
        if(gradBool){
            for(let i = 0; i < gradList.length - 1; i++){
                gradList[i] = gradList[i+1];
            }
            gradBool = !gradBool;
        }
        else{
            for(let i = gradList.length-1; i <= 1; i--){
                gradList[i] = gradList[i-1];
            }
            gradBool = !gradBool;
        }
        
    }
    gradList[gradList.length-1] = temp;
    console.log(gradList);
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight*5,[{percent:0.05,color:gradList[0]},{percent:0.1,color:gradList[1]},{percent:0.15,color:gradList[2]}, {percent:0.2,color:gradList[3]},{percent:0.25,color:gradList[4]} ,{percent:0.3,color:gradList[5]}, {percent:0.35,color:gradList[6]}, {percent:0.4,color:gradList[7]}, {percent:0.45,color:gradList[8]},{percent:0.5,color:gradList[9]},{percent:0.55,color:gradList[10]},{percent:0.6,color:gradList[11]},{percent:0.65,color:gradList[12]},{percent:0.7,color:gradList[13]},{percent:0.75,color:gradList[14]},{percent:0.8,color:gradList[15]},{percent:0.85,color:gradList[16]},{percent:0.9,color:gradList[17]},{percent:0.95,color:gradList[18]},{percent:1,color:gradList[19]}]);
};// end draw

const drawCelestialBody = (x, y, body, rotation, color) => {
    ctx.save();
        ctx.translate(canvasWidth/2,canvasHeight);
        ctx.save();
            ctx.rotate(rotation);
            ctx.translate(x,y);
            ctx.save();
            ctx.beginPath();
    ctx.moveTo(0,35 + audioData[0]/5);
    for(let i = 0; i < audioData.length; i++){
        //points[i] = (Math.random() * 15) + 50;
        ctx.lineTo(0,35 + audioData[i]/5);
        ctx.rotate((Math.PI * 2)/128); // 0.015625
    }
    //following loop is for "bars" mode
    /*for(let i = 0; i < audioData.length; i++){
        let currentPos = audioData[i]/5;
        ctx.moveTo(0,15 + currentPos);
        //points[i] = (Math.random() * 15) + 50;
        ctx.lineTo(0,35 + currentPos);
        ctx.rotate((Math.PI * 2)/128); // 0.015625
    }*/
    ctx.restore();
    //console.log(audioData.length);
    //ctx.strokeStyle = "white"; // used only if in bars mode
    ctx.fillStyle = color;
    ctx.closePath();
    //ctx.stroke(); // used only if in bars mode
    ctx.fill();
            ctx.drawImage(body,-50,-50,100,100);
            //ctx.restore();
        ctx.restore();
    ctx.restore();
}

const drawCoulds = (x,y,color) => {

}

export {setupCanvas,draw};