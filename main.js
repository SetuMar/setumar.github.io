import { Player } from "./player.js";
import { clearCanvas, drawRectangle } from "./canvas.js";
import { Tile } from "./level.js";
import { setDraw3dValue, settingsCollapsed, changeCollapsedState, updateFOV, updateWallColor, changeDrawShadows, changeShadowIntensity} from "./settings.js";

let lastTime = 0;
// previous time

const playerPos = Tile.generateLevel(window.innerWidth, window.innerHeight);
export const player = new Player(playerPos[0], playerPos[1]);

const settingsContainer = document.getElementById('settings-container');
// get the settings container

function update(time) {
    clearCanvas();
    setDraw3dValue(document.getElementById("draw-3d-view").checked);
    drawRectangle(0, 0, window.innerWidth, window.innerHeight, "rgb(0, 0, 0)");

    if (lastTime != null) {
        Tile.drawBlocks();
        player.update();
    }

    document.getElementById("settings-button").onclick = () => {
        settingsContainer.style.animation = "none";
        // reset animation
        void settingsContainer.offsetWidth;
        // trigger reflow (browser needs to recalculate positions)

        if (!settingsCollapsed) {
            settingsContainer.style.animation = "move-settings .25s ease-in-out forwards";
            // apply animation
            changeCollapsedState(true);
        } else {
            settingsContainer.style.animation = "move-settings .25s ease-in-out forwards reverse";
            // apply animation
            changeCollapsedState(false);
        }
    }

    updateFOV();
    updateWallColor();
    changeDrawShadows(document.getElementById("draw-shadows").checked);

    changeShadowIntensity();

    lastTime = time;
    // previous time
    window.requestAnimationFrame(update);
    // continue to call the function
        // creates an update loop
}

window.requestAnimationFrame(update);
// time is implicitly passed into the function