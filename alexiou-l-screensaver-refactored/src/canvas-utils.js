// canvas helpers
export const drawRectangle = (ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black") => {
    ctx.save(); // imediatly saves stack state so that the function can later load a previous state.
    ctx.fillStyle = fillStyle;
    ctx.beginPath()
    ctx.rect(x,y,width,height);
    ctx.fill();
    if(lineWidth > 0)
    {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore(); // imediatly resores previous saved stack state so that the function doesn't leave and residue
};

export const drawArc = (ctx, x, y, radius, fillStyle="black", lineWidth=0, strokeStyle="black", startAngle = 0, endAngle = Math.PI *2) => {
    ctx.save(); // imediatly saves stack state so that the function can later load a previous state.
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    // (x, y, radius, start angle (rad), end angle (rad), optional bool to determine clockwise or counter )
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.fill();
    if(lineWidth > 0)
    {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore(); // imediatly resores previous saved stack state so that the function doesn't leave and residue
};

export const drawLine = (ctx, x1, y1, x2, y2,lineWidth=1,strokeStyle="black") => {
    ctx.save(); // imediatly saves stack state so that the function can later load a previous state.
    ctx.beginPath();
    ctx.moveTo(x1,y1); // where you put the pen down
    ctx.lineTo(x2,y2); // where you move the pen to
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.restore(); // imediatly resores previous saved stack state so that the function doesn't leave and residue
};