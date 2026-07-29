/* ==========================================================================
   1. HERO TYPING EFFECT & INTERACTIVE SCROLL/TILT EFFECTS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1.1 Dynamic Typing Effect for Hero Heading --- */
    const roles = ["developer.", "gamer.", "sim racer.", "creator."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const heroHeading = document.querySelector('.hero-text h1');
    if (heroHeading) {
        heroHeading.innerHTML = `Hi, I'm <span class="typed-text"></span><span class="cursor">|</span>`;
        const typedTextSpan = document.querySelector('.typed-text');
        
        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }

    /* --- 1.2 Scroll Reveal Animation --- */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .skill-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    /* --- 1.3 3D Tilt Effect on Skill Cards --- */
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* --- 1.4 Active Navigation Router & Tab Switcher --- */
    const navLinks = document.querySelectorAll('.nav-links a');
    const pageSections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;

            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            pageSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            if (targetId === 'snake-game-section') {
                initSnakeCanvas();
            }
        });
    });

    initCursorGlow();
    initSnakeCanvas();
});


/* ==========================================================================
   2. RGB LIGHTING EFFECTS & CURSOR TRACKING
   ========================================================================== */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    window.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });
}

function setLightingMode(mode, buttonElement) {
    const root = document.documentElement;

    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');

    if (mode === 'rainbow') {
        root.style.setProperty('--rgb-speed', '2s');
    } else if (mode === 'slow') {
        root.style.setProperty('--rgb-speed', '8s');
    } else if (mode === 'pulse') {
        root.style.setProperty('--rgb-speed', '4s');
    }
}


/* ==========================================================================
   3. FULL SNAKE GAME ENGINE
   ========================================================================== */
let canvas, ctx;
const gridSize = 20;
let tileCount = 20;

let snake = [];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let nextDx = gridSize;
let nextDy = 0;
let score = 0;
let highScore = 0;
let gameInterval = null;
let isRunning = false;

document.addEventListener('keydown', changeDirection);

function initSnakeCanvas() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    tileCount = canvas.width / gridSize;
    clearCanvas();
}

function changeDirection(event) {
    const keyPressed = event.key.toLowerCase();

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if ((keyPressed === 'arrowleft' || keyPressed === 'a') && !goingRight) {
        nextDx = -gridSize;
        nextDy = 0;
    }
    if ((keyPressed === 'arrowup' || keyPressed === 'w') && !goingDown) {
        nextDx = 0;
        nextDy = -gridSize;
    }
    if ((keyPressed === 'arrowright' || keyPressed === 'd') && !goingLeft) {
        nextDx = gridSize;
        nextDy = 0;
    }
    if ((keyPressed === 'arrowdown' || keyPressed === 's') && !goingUp) {
        nextDx = 0;
        nextDy = gridSize;
    }
}

function startGame() {
    if (!canvas) initSnakeCanvas();
    if (!canvas) return;

    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    score = 0;
    dx = gridSize;
    dy = 0;
    nextDx = gridSize;
    nextDy = 0;

    const scoreElem = document.getElementById('currentScore');
    if (scoreElem) scoreElem.textContent = score;

    spawnFood();
    
    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.style.display = 'none';

    if (gameInterval) clearInterval(gameInterval);
    isRunning = true;
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (hasGameEnded()) {
        handleGameOver();
        return;
    }

    dx = nextDx;
    dy = nextDy;

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = '#0f131a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#18202c';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        const scoreElem = document.getElementById('currentScore');
        if (scoreElem) scoreElem.textContent = score;

        if (score > highScore) {
            highScore = score;
            const highScoreElem = document.getElementById('highScore');
            if (highScoreElem) highScoreElem.textContent = highScore;
        }
        spawnFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#10b981' : '#34d399';
        ctx.strokeStyle = '#0f131a';
        ctx.lineWidth = 2;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(part.x, part.y, gridSize, gridSize, [4]);
        } else {
            ctx.rect(part.x, part.y, gridSize, gridSize);
        }
        ctx.fill();
        ctx.stroke();
    });
}

function drawFood() {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
        }
    });
}

function hasGameEnded() {
    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x >= canvas.width;
    const hitTop = snake[0].y < 0;
    const hitBottom = snake[0].y >= canvas.height;

    if (hitLeft || hitRight || hitTop || hitBottom) return true;

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }

    return false;
}

function handleGameOver() {
    clearInterval(gameInterval);
    isRunning = false;

    const overlayTitle = document.getElementById('overlayTitle');
    const overlaySubtitle = document.getElementById('overlaySubtitle');
    const overlay = document.getElementById('gameOverlay');

    if (overlayTitle) {
        overlayTitle.textContent = 'GAME OVER';
        overlayTitle.style.color = 'var(--accent-red)';
    }
    if (overlaySubtitle) {
        overlaySubtitle.textContent = `Final Score: ${score}`;
    }
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Bind function globally so HTML onclick="startGame()" works smoothly
window.startGame = startGame;