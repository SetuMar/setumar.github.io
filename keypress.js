export let currentPressedKeys = new Set()
export let mouseX = 0
export let mouseY = 0

document.addEventListener("keydown", (e) => {
    currentPressedKeys.add(e.key)
})

document.addEventListener("keyup", (e) => {
    currentPressedKeys.delete(e.key)
})

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})