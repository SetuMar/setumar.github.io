import { Tile } from "./level.js"
import { drawLine, drawRectangle } from "./canvas.js";
import { draw3dView, hexToRGB, wallColor } from "./settings.js";
import { FOV } from "./settings.js";
import { drawShadows, shadowIntensity } from "./settings.js";

export class Ray {
    static wallHeightMultiplier = 50;

    constructor(playerPos, angle, playerAngle, rayNum = 0) {
        this.newRayDir(playerPos, angle)
        this.rayNum = rayNum
        this.playerAngle = playerAngle
    }

    static calculateDistance(point1, point2) {
        // Extract coordinates from the points
        const [x1, y1] = point1;
        const [x2, y2] = point2;

        // Calculate the distance using the Euclidean formula
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Check if the distance is NaN
        if (isNaN(distance)) {
            return Infinity;
        }

        return distance;
    }
        
    newRayDir(player_pos, angle){
        this.playerPos = player_pos
        this.angle = angle % 360
        // ensure angle being used is not over 360 degrees

        this.generateRaycasting();
        this.raycastUpdate()
    }
        
    generateHorizontalStartingPosition() {
        let horizontalStartingPos = [0, 0];

        const modDif = this.playerPos[0] % Tile.width

        if ((90 < this.angle && this.angle < 270)) {
            horizontalStartingPos[0] = this.playerPos[0] - modDif;
            horizontalStartingPos[1] = this.playerPos[1] + modDif * Math.tan(this.angle * Math.PI/180);
        }
        else {
            horizontalStartingPos[0] = this.playerPos[0] + (Tile.width - modDif);
            horizontalStartingPos[1] = this.playerPos[1] - (Tile.width - modDif) * Math.tan(this.angle * Math.PI/180);
        }

        return horizontalStartingPos;
    }
    
    generateVerticalStartingPosition() {
        let verticalStartingPos = [0, 0];
    
        const modDif = this.playerPos[1] % Tile.height;
    
        if (0 < this.angle && this.angle < 180) {
            verticalStartingPos[0] = this.playerPos[0] - modDif * Math.tan((this.angle + 90) * Math.PI / 180);
            verticalStartingPos[1] = this.playerPos[1] - modDif;
        } else {
            verticalStartingPos[0] = this.playerPos[0] + (Tile.height - modDif) * Math.tan((this.angle + 90) * Math.PI / 180);
            verticalStartingPos[1] = this.playerPos[1] + (Tile.height - modDif);
        }
    
        return verticalStartingPos;
    }

    generateRaycasting() {
        this.horizontalPosition = this.generateHorizontalStartingPosition();
        // current_position of the horizon=tal arm
        this.horizontalDistance = 0;
        // distance travelled for horizontal ray
        this.horizontalCollision = false;
        // check for a horizontal collision
        
        try {
            this.horizontalDirection = [Tile.width, Tile.width * (Math.cos((this.angle + 90) * Math.PI / 180)) / Math.sin((this.angle + 90) * Math.PI / 180)];
            // horizontal directional movement
            
            if (90 <= this.angle && this.angle <= 270) {
                this.horizontalDirection[0] = -this.horizontalDirection[0];
                this.horizontalDirection[1] = -this.horizontalDirection[1];
            }
            // fixes the ray's direction's positive && negative T
            
            this.horizontalDistance = Ray.calculateDistance(this.playerPos, this.horizontalPosition)
            // distance to player
            
        } catch {
            this.horizontalDirection = [0, 0];
        }
            
        this.verticalPosition = this.generateVerticalStartingPosition();
        // current_position of the horizontal arm
        this.verticalDistance = 0;
        // distance travelled for horizontal ray
        this.verticalCollision = false;
        // if vertical collision has been detected
        
        try {
            this.verticalDirection = [Tile.height * (Math.sin((this.angle + 90) * Math.PI / 180)) / Math.cos((this.angle + 90) * Math.PI / 180), Tile.height];
            // deal with angles over 360 degrees
            
            if (0 <= this.angle && this.angle <= 180) {
                this.verticalDirection[0] = -this.verticalDirection[0];
                this.verticalDirection[1] = -this.verticalDirection[1];
            }
            // fixes the ray's direction's positive && negative signs
            
            this.verticalDistance = Ray.calculateDistance(this.playerPos, this.verticalPosition)
            // distance to player
        } catch {
            this.verticalDirection = [0, 0]
        }
    }

    raycastUpdate() {
        while (Number(this.horizontalCollision) + Number(this.verticalCollision) < 2) {
            if ((this.verticalPosition[0] > window.innerWidth) || (this.verticalPosition[0] < 0) || (this.verticalDirection[0] == 0 && this.verticalDirection[1] == 0)) {
                this.verticalCollision = true;
            }
            
            if ((this.horizontalPosition[1] < 0) || (this.horizontalPosition[1] > window.innerHeight) || (this.horizontalDirection[0] == 0 && this.horizontalDirection[1] == 0)) {
                this.horizontalCollision = true;
            }
        
            Tile.blocks.forEach(b => {
                if (Tile.pointCollision(this.verticalPosition[0], this.verticalPosition[1], b.x, b.y)) {
                    this.verticalDistance = Ray.calculateDistance(this.playerPos, this.verticalPosition);
                    this.verticalCollision = true;
                }
                
                if (Tile.pointCollision(this.horizontalPosition[0], this.horizontalPosition[1], b.x, b.y)) {
                    this.horizontalDistance = Ray.calculateDistance(this.playerPos, this.horizontalPosition);
                    this.horizontalCollision = true;
                }
            });
                            
            if (this.horizontalCollision == false) {
                this.horizontalPosition[0] += this.horizontalDirection[0];
                this.horizontalPosition[1] += this.horizontalDirection[1];
                this.horizontalDistance = Ray.calculateDistance(this.playerPos, this.horizontalPosition);
            }
            
            if (this.verticalCollision == false) {
                this.verticalPosition[0] += this.verticalDirection[0];
                this.verticalPosition[1] += this.verticalDirection[1];
                this.verticalDistance = Ray.calculateDistance(this.playerPos, this.verticalPosition);
            }
        }

        if (this.verticalDistance < this.horizontalDistance) {
            this.smallerPos = this.verticalPosition;
            this.smallerDist = this.verticalDistance;
        } else {
            this.smallerPos = this.horizontalPosition;
            this.smallerDist = this.horizontalDistance;
        }
    }

    drawRay() {
        if (!draw3dView) {
            drawLine(this.playerPos[0], this.playerPos[1], this.smallerPos[0], this.smallerPos[1], "green");
        } else {

            const SCREEN_DIST = window.innerWidth / Math.tan((FOV / 2) * (Math.PI/180));
            const SCALE = Math.floor(window.innerWidth / FOV);

            this.smallerDist *= Math.cos((this.playerAngle - this.angle) * Math.PI/180)
            // removes the fisheye effect

            let projectionHeight;
            try {
                projectionHeight = SCREEN_DIST / this.smallerDist;
            } catch {
                projectionHeight = 0
            }

            let color = hexToRGB(wallColor);

            if (drawShadows) {                
                let colorMult = 1 - (this.smallerDist / (SCREEN_DIST * (1 - shadowIntensity)));
                color[0] = Math.round(colorMult * color[0]);
                color[1] = Math.round(colorMult * color[1]);
                color[2] = Math.round(colorMult * color[2]);
            }

            let formattedColor = "rgb(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ")"

            drawRectangle(this.rayNum * SCALE, (window.innerHeight/2 - projectionHeight/2) - window.innerHeight/4, SCALE, projectionHeight * Ray.wallHeightMultiplier, formattedColor);
        }
    }
}