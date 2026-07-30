// Robust key tracking using physical key codes (e.code)
const keys = {};

window.addEventListener('keydown', e => {
    // Prevent default scrolling for game keys like Space or Arrow keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
    keys[e.code] = true;
    
    if (e.code === 'Space') {
        tryPlaceBreach();
    }
});

window.addEventListener('keyup', e => {
    keys[e.code] = false;
});

// Inside your update() function, check for physical keys:
let dx = 0, dy = 0;
if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
if (keys['KeyD'] || keys['ArrowRight']) dx += 1;