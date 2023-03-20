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
import { getNote } from './audio.js';

let ctx,canvasWidth,canvasHeight,analyserNode,audioData;

let images = [];
let rotation = 0; 
let towers = [];
let stepIncrement = 0;
let fire;

class TowerSprite{
    static type = "tower";
    constructor({x=0,y=0, width=30, height=((-getNote()/7 <= -200) ? 0 : (-getNote()/7))} = {}){ // - Uses destructuring to create defaults, as well as a default for the entire thing
        // Initialize properties
        this.x = x;
        this.y = y;
        this.body = images[2];
        this.width = width;
        this.height = height;
        this.color = utils.getRandomColor();
        //console.log(`${this.constructor.type} created with params of: x:${this.x}, height: ${this.height}, width: ${this.width}`);
        return Object.seal(this); // No longer able to add properties
    }
    
    update(){
        // Increase the .x property by 1
        this.x += 1;
    }
    
    draw(ctx){
        // Draw a tower at the x & y
        ctx.save();
        ctx.translate(-50,canvasHeight);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, 0,this.width,this.height);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(this.body,this.x,this.height -26,this.width, 300);
        
        ctx.restore();
    }
}

class FireSprite{
    static type = "fire";
    constructor(){
        //initialize properties | No defaults, there's only one.
        this.x = 0;
        this.y = 0;
        this.width = 204;
        this.height = 195;
        this.body = images[4];
        this.control = 0;
        this.frequency = 0;
        this.transparency = 0;
        return Object.seal(this); // No longer able to add properties
    }

    setTransparency(value){
        this.transparency = value;
    }

    update(){
        if(this.frequency == 3){ // so that it updates at 30 fps instead of 60
            this.x += this.width;
            if(this.control == 2 && this.x >= 408){ // will prevent the animation from showing that false-frame
                this.control = 0;
                this.x = 0;
                this.y = 0;
            }
            //Once x goes out of range, reset it & got to next y-level.
            if(this.x >= 612){
                this.x = 0;
                this.y += this.height;
                this.control++;
            }
            //Once y goes out of range, reset it.
            if(this.y > 612){
                this.y = 0;
            }
            this.frequency = 0;
        }
        this.frequency++;
    }
    
    draw(body,ctx){
        ctx.save();
        ctx.globalAlpha = this.transparency;
        ctx.drawImage(body, this.x, this.y, this.width, this.height, 0, 0, canvasWidth, canvasHeight*1.2);
        ctx.restore();
        //console.log(`x: ${this.x}       y: ${this.y}`);
    }
}
fire = new FireSprite();

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
    // keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
    images = loader.images;
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
	
    

    // 3 - draw custom gradient image
    ctx.beginPath();
    ctx.closePath();
    ctx.save();
    ctx.translate(canvasWidth/2,canvasHeight);
    ctx.rotate(rotation);
    //ctx.drawImage(images[3],-1000,-1000,2000,2000);
    ctx.drawImage(images[3],-575,-575,1150,1150);
    //console.log(images[3]);
    ctx.restore();

    // 4 - drawing images
    drawCelestialBody(0, -canvasHeight + 60, images[0], rotation, "#53676C", params);
    drawCelestialBody(0, canvasHeight - 60, images[1], rotation, "#FFC257", params);

    fire.update();
    fire.draw(images[4], ctx); // some reason, it doesn't like when I have the image to draw set in constructor - odd

    //creating towers
    if(stepIncrement >= 31){
        stepIncrement = 0;
        towers.push(new TowerSprite(0, 50, 30, 30));
    }
    
    //drawing towers
    for(let i = 0; i < towers.length; i++){
        towers[i].update();
        towers[i].draw(ctx);
        if(towers[i].x > canvasWidth + 90){
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
			data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
			data[i] = 150;// make the red channel slightly red
            data[i+1] = 125;// make the gren channel a tad green
            data[i+2] = 255;// make the blue channel very blue
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

//helper functions 

// drawCelestialBody - Helper function to draw sun & moon, as well as their respective bars & "circles".
const drawCelestialBody = (x, y, body, rotation, color, params) => {
    ctx.save();
    ctx.translate(canvasWidth/2,canvasHeight);
    ctx.save();
    ctx.rotate(rotation);
    ctx.translate(x,y);
    ctx.save();
    ctx.beginPath();
    if(params.showCircles){
        ctx.lineJoin = "round";
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
};

export {setupCanvas,draw, fire};