import { drawRectangle } from "./canvas.js";
import { Player } from "./player.js";
import { draw3dView, wallColor } from "./settings.js";

export class Tile {
    static level = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, "P", 0, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
    ]

    // "P" is for player
    // 1 is for Tile
    // 0 is for empty

    static blocks = [];
    static width = Math.ceil(window.innerWidth / this.level[0].length);
    static height = Math.ceil(window.innerHeight / this.level.length);

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static generateLevel(canvasWidth, canvasHeight) {
        Tile.blocks = [];
        Tile.width = Math.ceil(canvasWidth / this.level[0].length);
        Tile.height = Math.ceil(canvasHeight / this.level.length);

        let playerPos = null

        Tile.level.forEach((row, y) => {
            row.forEach((num, x) => {
                if (num == 1) {
                    Tile.blocks.push(
                        new Tile(x * Tile.width, y * Tile.height)
                    );
                } else if (num == "P") {
                    playerPos = [x * Tile.width, y * Tile.height]
                }
            });
        });

        return playerPos;
    }

    static tilesCollisionCheck(possiblePlayerX, possiblePlayerY) {
        let collisionDetected = false;

        Tile.blocks.forEach(block => {
            if (block.x < possiblePlayerX + Player.width && block.x + Tile.width > possiblePlayerX
                && block.y < possiblePlayerY + Player.width && block.y + Tile.height > possiblePlayerY && !collisionDetected){
                    collisionDetected = true;
                }
        });
        return collisionDetected;
    }

    static pointCollision(pointX, pointY, rectX, rectY) {
        let pointCollisionDetected = false;

        if (rectX < pointX && rectX + Tile.width > pointX
            && rectY < pointY && rectY + Tile.height > pointY && !pointCollisionDetected){
                pointCollisionDetected = true;
            }
        
        return pointCollisionDetected;
    }

    static pointCollision(pointX, pointY, rectX, rectY) {
        let pointCollisionDetected = false;
    
        if (pointX >= rectX && !pointCollisionDetected && pointX <= rectX + Tile.width
            && pointY >= rectY && pointY <= rectY + Tile.height){
                pointCollisionDetected = true;
            }
        
        return pointCollisionDetected;
    }

    static drawBlocks() {
        if (!draw3dView) {
            Tile.blocks.forEach(block => {
                drawRectangle(block.x, block.y, Tile.width, Tile.height, wallColor);
            });
        }
    }
}