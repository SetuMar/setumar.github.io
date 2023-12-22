import { drawRotatingRect } from "./canvas.js";
import { currentPressedKeys } from "./keypress.js"
import { Tile } from "./level.js";
import { Ray } from "./ray.js";
import { FOV, draw3dView } from "./settings.js";

export class Player {
    // speed
    // low so that collisions are extremely accurate
    static speed = 0.035;
    
    // how many times to move per update call
    static increaseAmount = 50;

    // amount to change angle by
    static angleIncrease = 10;
    
    // width of player (in 2d view)
    static width = Tile.height/4;

    // FOV of player
    static FOV = 60;

    constructor(x, y) {
        // previous position and angle
        this.prevX = null;
        this.prevY = null;
        this.prevAngle = null;
        
        // position
        this.x = x;
        this.y = y;
        
        // what percent of the screen is the player's x and y at
        // used for resize
        this.xPercent = this.x / window.innerWidth;
        this.yPercent = this.y / window.innerHeight;

        // angle of player
        this.angle = 0;

        // generate list of rays (all null -> tbd)
        this.rays = []
        for (let i = 0; i < FOV; i++) { this.rays.push(null); };
    }

    generateAngleMovementVector(angle, keys_input) {
        const asRadians = angle * (Math.PI / 180);
        // convert angle into radians
            // needed for math operations

        let movementVector = [0, 0]
        movementVector[0] = keys_input * Math.cos(asRadians);
        movementVector[1] = keys_input * -Math.sin(asRadians);
        // generate movement vector

        return movementVector;
        // return movement vector
    }

    windowResize() {
        this.x = window.innerWidth * this.xPercent;
        this.y = window.innerHeight * this.yPercent;
        Player.width = Tile.height / 4;
        Player.speed = Tile.width * 0.0015;
    }

    update() {
        // used for visuals
        if (!draw3dView) {
            this.angle += (currentPressedKeys.has("ArrowRight") - currentPressedKeys.has("ArrowLeft")) * Player.angleIncrease;
        } else {
            this.angle += (currentPressedKeys.has("ArrowRight") - currentPressedKeys.has("ArrowLeft")) * -Player.angleIncrease;
        }

        // used for math
        let mathAngle = (Math.abs(this.angle) / 2) % 360

        // ensure that if the angle is down, then it loops back to 360
        if (this.angle > 0) { mathAngle = 360 - mathAngle; }

        // get movement vector for vertical movement
        const verticalMovementVector = this.generateAngleMovementVector(mathAngle, currentPressedKeys.has("w") - currentPressedKeys.has("s"))
        
        // get movement vector for horizontal movement
        // add 90 degrees for left/right movement
        // direction of movement switches depending on if in 3d or 2d view
        const horizontalMovementVector = this.generateAngleMovementVector(mathAngle + 90, (currentPressedKeys.has("a") - currentPressedKeys.has("d")) * (draw3dView ? -1 : 1))

        // calculate sum of movement vectors
        const totalMovement = [horizontalMovementVector[0] + verticalMovementVector[0], horizontalMovementVector[1] + verticalMovementVector[1]]

        // check if the vector isn't [0, 0] -> can be normalized
        if (totalMovement[0] != 0 || totalMovement[1] != 0){
            // calculate magnitude
            const totalMagnitude = Math.sqrt(Math.pow(totalMovement[0], 2) + Math.pow(totalMovement[1], 2))

            // normalize vector
            totalMovement[0] /= totalMagnitude;
            totalMovement[1] /= totalMagnitude;
            
            // move the player using movement vector repeatedly
            for (let index = 0; index < Player.increaseAmount; index++) {

                // only let the player move if the player isn't colliding with a wall
                if (!(Tile.tilesCollisionCheck(this.x + totalMovement[0] * Player.speed, this.y + totalMovement[1] * Player.speed))) {
                    // add normalized vector to player, multply by speed to ensure it updates at correct speed
                    this.x += totalMovement[0] * Player.speed;
                    this.y += totalMovement[1] * Player.speed;
                }
                else {
                    break;
                }
            }
        }

        // 
        for (let angleIncrease = -FOV/2; angleIncrease < FOV/2; angleIncrease++) {
            // determine index in array of rays
            const index = angleIncrease + FOV/2;
            // current ray
            let r = this.rays[index];

            // if ray is null, player has moved, or angle has changed, then recalculate the ray
            if (r == null || this.x != this.prevX || this.y != this.prevY || this.prevAngle != this.angle) {
                r = new Ray([this.x + Player.width/2, this.y + Player.width/2], mathAngle + angleIncrease, mathAngle, index);
            }
            
            r.raycastUpdate();
            r.drawRay();
        }

        // determine percentage of movement on window
        this.xPercent = this.x / window.innerWidth;
        this.yPercent = this.y / window.innerHeight;

        // determine previous co-ordinates and angle
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevAngle = this.angle;

        // draw player (rectangle)
        if (!draw3dView) {
            drawRotatingRect(this.x, this.y, Player.width, Player.width, mathAngle * -1, "red");
        }
    }
}