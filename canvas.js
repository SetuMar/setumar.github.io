import { Tile } from "./level.js";
import { player } from "./main.js";

// get the canvas
export const canvas = document.getElementById("canvas");
// canvas context
const ctx = canvas.getContext("2d");

// ensure canvas is of right size upon load
window.addEventListener('load', ()=> { resizeCanvas(); } );

// resize canvas if it changes size
window.addEventListener('resize', ()=> { resizeCanvas(); } );

export function resizeCanvas() {
    // change canvas to the width of the window
    canvas.width = window.innerWidth;
    // change canvas to the height of the window
    canvas.height = window.innerHeight;

    // regenerate resized level
    Tile.generateLevel(canvas.width, canvas.height)

    // modify player properties upon resize
    player.windowResize()
}

export function clearCanvas() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function drawRectangle(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fill()

    ctx.fillStyle = null;
    ctx.strokeStyle = null;
}

export function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();

    if (color == null) { color = "red"; }
    ctx.strokeStyle = color;
    ctx.fill()

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = null;
}

export function drawRotatingRect(x, y, width, height, degrees, color) {
    ctx.save()
    // saves configuration of canvas
    ctx.beginPath()
    // creates a new rectangle to draw
    ctx.translate(x + width/2, y + height/2);
    // move to rotate
    ctx.rotate(degrees * (Math.PI/180));
    // rotate
        // use radians instead of degrees

    ctx.rect(-width/2, -height/2, width, height);
    // move back to starting rotation position

    ctx.fillStyle = color;
    // fill color
    ctx.strokeStyle = color;
    // stroke color
    ctx.fill()
    // fill rectangle with color
    ctx.restore()
    // reset canvas configuration
    ctx.fillStyle = null;
}