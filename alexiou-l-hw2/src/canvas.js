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
let towers = [];
let testTower;
let stepIncrement = 0;

class TowerSprite{
    static type = "tower"; // demoing a static (class) variable here
    constructor({x=0,y=0, width=30, height=-audioData[0] + 50} = {}){ // - Uses destructuring to create defaults, as well as a default for the entire thing
        //console.log(`${this.constructor.type} created`); // access static property (alternatively, TowerSprite.type)
        // Initialize .x, .y, .radius and .color properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        //console.log(`${this.constructor.type} created with params of: x:${this.x}, height: ${this.height}, width: ${this.width}`);
        return Object.seal(this); // No longer able to add properties
    }
    
    update(){
        // Increase the .x property by 1
        this.x += 1;
    }
    
    draw(body, ctx){
        // Draw a tower at the x & y
        ctx.save();
        ctx.translate(-50,canvasHeight);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, 0,this.width,this.height);
        ctx.closePath();
        ctx.fill();
        //ctx.drawImage(this.body,this.x,0,this.width,this.height);
        ctx.drawImage(body,this.x,this.height -26,this.width, 300);
        
        ctx.restore();
    }
}

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
    rotation += .003;
    stepIncrement++;
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
	
    images = loader.images;

    // 3 - draw custom gradient image
    ctx.beginPath();
    ctx.closePath();
    ctx.save();
    ctx.translate(canvasWidth/2,canvasHeight);
    ctx.rotate(rotation);
    ctx.drawImage(images[3],-575,-575,1150,1150);
    ctx.restore();
    

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
    


    // 4 - drawing images
    drawCelestialBody(0, -canvasHeight + 60, images[0], rotation, "#53676C", params);
    drawCelestialBody(0, canvasHeight - 60, images[1], rotation, "#FFC257", params);
    if(stepIncrement >= 31){
        stepIncrement = 0;
        towers.push(new TowerSprite(0, 50, 30, 50));
    }
    
    for(let i = 0; i < towers.length; i++){
        towers[i].update();
        towers[i].draw(images[2], ctx);
        if(towers[i].x > canvasWidth + 50){
            towers.splice(i, 1);
            //console.log("last tower deleted");
        }
    }
    
    // 5 - bitmap manipulation
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
    

};// end draw

//
const drawCelestialBody = (x, y, body, rotation, color, params) => {
    ctx.save();
    ctx.translate(canvasWidth/2,canvasHeight);
    ctx.save();
    ctx.rotate(rotation);
    ctx.translate(x,y);
    ctx.save();
    ctx.beginPath();
    if(params.showCircles){
        ctx.moveTo(0,35 + audioData[0]/5);
        for(let i = 0; i < audioData.length; i++){
            //points[i] = (Math.random() * 15) + 50;
            //ctx.lineTo(0,35 + audioData[i]/5);
            ctx.bezierCurveTo(0, 35 + audioData[i]/5, 0, 35 + audioData[i]/5, 0, 35 + audioData[i]/5);
            ctx.rotate((Math.PI * 2)/128); // 0.015625
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    //following loop is for "bars" mode
    if(params.showBars){
        ctx.beginPath();
        for(let i = 0; i < audioData.length; i++){
            let currentPos = audioData[i]/5;
            ctx.moveTo(0,15 + currentPos);
            //points[i] = (Math.random() * 15) + 50;
            ctx.lineTo(0,35 + currentPos);
            ctx.rotate((Math.PI * 2)/128); // 0.015625
        }
        ctx.closePath();
        ctx.strokeStyle = "white"; // used only if in bars mode
        ctx.stroke();
    }
    ctx.restore();
    //console.log(audioData.length);
    
    //ctx.stroke(); // used only if in bars mode
    //ctx.fill();
    ctx.drawImage(body,-50,-50,100,100);
    ctx.restore();
    ctx.restore();
}



export {setupCanvas,draw};