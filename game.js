const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const W = canvas.width;
const H = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 18;
const BALL_RADIUS = 10;
const PLAYER_X = PADDLE_MARGIN;
const AI_X = W - PADDLE_MARGIN - PADDLE_WIDTH;

// Game state
let playerY = H / 2 - PADDLE_HEIGHT / 2;
let aiY = H / 2 - PADDLE_HEIGHT / 2;
let ballX = W / 2;
let ballY = H / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() * 2 - 1);

// Paddle control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > H - PADDLE_HEIGHT) playerY = H - PADDLE_HEIGHT;
});

// Drawing functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.fill();
}
function drawNet() {
    ctx.strokeStyle = "#444";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(W/2, 0);
    ctx.lineTo(W/2, H);
    ctx.stroke();
    ctx.setLineDash([]);
}

// AI movement
function moveAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 20) aiY += 4;
    else if (aiCenter > ballY + 20) aiY -= 4;
    if (aiY < 0) aiY = 0;
    if (aiY > H - PADDLE_HEIGHT) aiY = H - PADDLE_HEIGHT;
}

// Ball and collision
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > H) {
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add "spin"
        let hitPos = (ballY - (playerY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY = 5 * hitPos;
    }

    // AI paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let hitPos = (ballY - (aiY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY = 5 * hitPos;
    }

    // Reset if out of bounds
    if (ballX < 0 || ballX > W) {
        ballX = W / 2;
        ballY = H / 2;
        ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = 3 * (Math.random() * 2 - 1);
    }
}

// Main loop
function loop() {
    moveAI();
    updateBall();

    ctx.clearRect(0, 0, W, H);
    drawNet();
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f0f");
    drawBall(ballX, ballY, BALL_RADIUS, "#fff");

    requestAnimationFrame(loop);
}

loop();