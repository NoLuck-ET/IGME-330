// #0 - in this class we will always use ECMAScript 5's "strict" mode
// See what 'use strict' does here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode

import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";

let ctx;
let paused = false;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

const init = () => {
    console.log("page loaded!");
    // #2 Now that the page has loaded, start drawing!
    
    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");
    
    // B - the `ctx` variable points at a "2D drawing context"
    ctx = canvas.getContext("2d");
    
    // C - all fill operations are now in red
    ctx.fillStyle = "red"; 
    // ctx.fillStyle = "#FF0000"; 
    // ctx.fillStyle = "#F00"; 
    // ctx.fillStyle = "rgba(255,0,0,1)"; 
    
    // D - fill a rectangle with the current fill color
    ctx.fillRect(20,20,600,440); ;

    // // rect();
    drawRectangle(ctx,120,120,400,300,"yellow",10,"magenta");

    // // lines
    drawLine(ctx, 20, 20, 620, 460, 5, "magenta");
    drawLine(ctx, 620, 20, 20, 460, 5, "magenta");

    // // cirlce
    drawArc(ctx, 320, 240, 50, "green",5,"purple", 0,Math.PI *2);

    // // semi-circle
    drawArc(ctx, 320, 250, 20, "gray",3,"yellow", 0,Math.PI);

    setupUI();

    update();
};

const update = () => {
    if(paused) return; 
    requestAnimationFrame(update);
    if(createRectangles) drawRandomRect(ctx);
    if(createArcs) drawRandomArc(ctx);
    if(createLines) drawRandomLine(ctx);
};

const drawRandomRect = (ctx) =>{
    //drawRectangle(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black")
    drawRectangle(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(10,90),getRandomInt(10,90),getRandomColor(),getRandomInt(2,12),getRandomColor())
};

const drawRandomArc = (ctx) => {
    //drawArc(ctx, x, y, radius, fillStyle="black", lineWidth=0, strokeStyle="black", startAngle = 0, endAngle = Math.PI *2)
    drawArc(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(10,50), getRandomColor(),getRandomInt(0,10), getRandomColor(), getRandomInt(0, Math.PI *2),  getRandomInt(0, Math.PI *2));
};

const drawRandomLine = (ctx) => {
    //drawLine(ctx, x1, y1, x2, y2,lineWidth=1,strokeStyle="black")
    drawLine(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(0,640),getRandomInt(0,480), getRandomInt(1,10), getRandomColor());

};

// event handlers
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX,mouseY);
    for(let i = 0; i < 10; i++){
        let x = getRandomInt(-100,100) + mouseX;
        let y = getRandomInt(-100,100) + mouseY;
        let radius = getRandomInt(10,30);
        let startAngle = getRandomInt(0, Math.PI*2);
        let endAngle = getRandomInt(0, Math.PI*2);
        let color = getRandomColor();
        //drawRectangle(ctx,x,y,width,height,color);
        //drawArc(ctx, x, y, radius, color, 0, 0, Math.PI * 2);
        drawArc(ctx, x, y, radius, color, 0, color, startAngle, endAngle);
    }
};

let gate = true;

//helpers
const setupUI = () => {
    document.querySelector("#btn-pause").onclick = function(){
        paused = true;
        gate = false;
    };
    
    document.querySelector("#btn-play").onclick = function(){
        paused = false;
        if(!gate)
        {
            update();
        }
        gate = true;
    };

    //clear canvas
    document.querySelector("#btn-clear").onclick = function(){
        ctx.clearRect(0,0,640,480);
    }
    
    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = function(e){
        createRectangles = e.target.checked;
    };

    document.querySelector("#cb-arcs").onclick = function(e){
        createArcs = e.target.checked;
    };

    document.querySelector("#cb-lines").onclick = function(e){
        createLines = e.target.checked;
    };
};

init();