let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

// ✅ Load raptor and cop sprite sheets
let dinoSprite = new Image();
dinoSprite.src = "raptor_sprite_sheet.png"; // Make sure the path matches!

let copSprite = new Image();
copSprite.src = "cop_sprite_sheet.png"; // Use the one we generated!

// ✅ Dino sprite animation settings
const dinoFrameWidth = 128;
const dinoFrameHeight = 128;
const dinoTotalFrames = 8;

// ✅ Cop sprite animation settings
const copFrameWidth = 128;
const copFrameHeight = 128;
const copTotalFrames = 6; // Adjust if needed based on your sheet

let dinoFrame = 0;
let copFrame = 0;
let frameTimer = 0;
const frameDelay = 5;

let dino = {
    x: 50,
    y: 200,
    width: 50,
    height: 50,
    jumpHeight: 50,
    speed: 2,
    isJumping: false
};

let obstacles = [];
let bullets = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !dino.isJumping) {
        dino.isJumping = true;
        dino.y -= dino.jumpHeight;
    }
});

// 🧱 Spawn either regular obstacle or a cop
function spawnObstacle() {
    let type = Math.random() < 0.5 ? "block" : "cop";
    if (type === "block") {
        obstacles.push({
            type: "block",
            x: canvas.width,
            y: 200,
            width: 20 + Math.random() * 30,
            height: 30 + Math.random() * 30
        });
    } else {
        obstacles.push({
            type: "cop",
            x: canvas.width,
            y: 200,
            width: 50,
            height: 50,
            bulletTimer: 0
        });
    }
}

// 🦖 Draw dino animation frame
function drawDino() {
    frameTimer++;
    if (frameTimer >= frameDelay) {
        frameTimer = 0;
        dinoFrame = (dinoFrame + 1) % dinoTotalFrames;
        copFrame = (copFrame + 1) % copTotalFrames;
    }

    ctx.drawImage(
        dinoSprite,
        dinoFrame * dinoFrameWidth, 0,
        dinoFrameWidth, dinoFrameHeight,
        dino.x, dino.y,
        dino.width, dino.height
    );
}

// 👮 Draw cop animation frame
function drawCop(cop) {
    ctx.drawImage(
        copSprite,
        copFrame * copFrameWidth, 0,
        copFrameWidth, copFrameHeight,
        cop.x
