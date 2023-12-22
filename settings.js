export let draw3dView = false;
export function setDraw3dValue(value) { draw3dView = value; }
// if to draw 3d view or to draw 2d view

export let settingsCollapsed = false;
export function changeCollapsedState(value) { settingsCollapsed = value; }

export let FOV = 60;
export function updateFOV() { FOV = document.getElementById("FOV-slider").value; }

export let wallColor = "#FF0000";
export function updateWallColor() { wallColor = document.getElementById("wall-color-picker").value; }

export function hexToRGB(hex) {
    hex = hex.replace('#', '');
    // gets rid of the # symbol
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 7), 16);
    // get rgb values -> get letters, parse as base 16 
    
    // Return the array of RGB values
    return [r, g, b];
}

export let drawShadows = false;
export function changeDrawShadows(value) { drawShadows = value; }

export let shadowIntensity = 0.4;
export function changeShadowIntensity() { shadowIntensity = document.getElementById("shadow-intensity-slider").value; }