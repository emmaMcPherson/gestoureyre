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
        cop.x, cop.y,
        cop.width, cop.height
    );
}

// 🔫 Draw and update bullets
function updateBullets() {
    bullets.forEach((bullet, i) => {
        bullet.x -= bullet.speed;
        ctx.fillStyle = "black";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (
            dino.x + dino.width > bullet.x &&
            dino.x < bullet.x + bullet.width &&
            dino.y + dino.height > bullet.y
        ) {
            gameOver = true;
        }

        if (bullet.x + bullet.width < 0) {
            bullets.splice(i, 1);
        }
    });
}

// 🚀 Main game update
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameOver) {
        document.getElementById("gameOver").style.display = "block";
        return;
    }

    if (dino.isJumping) {
        dino.y -= 5;
        if (dino.y <= 100) dino.isJumping = false;
    } else if (dino.y < 200) {
        dino.y += 5;
    }

    drawDino();

    obstacles.forEach((obs, index) => {
        obs.x -= dino.speed;

        if (obs.type === "block") {
            ctx.fillStyle = "brown";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        } else if (obs.type === "cop") {
            drawCop(obs);
            obs.bulletTimer++;

            if (obs.bulletTimer >= 60) { // fires every ~1 second
                bullets.push({
                    x: obs.x,
                    y: obs.y + 20,
                    width: 10,
                    height: 4,
                    speed: 5
                });
                obs.bulletTimer = 0;
            }
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        if (
            dino.x + dino.width > obs.x &&
            dino.x < obs.x + obs.width &&
            dino.y + dino.height > obs.y
        ) {
            gameOver = true;
        }
    });

    updateBullets();

    document.getElementById("score").innerText = `Score: ${score}`;
    requestAnimationFrame(update);
}

setInterval(spawnObstacle, 2000);
update();

// 💾 Save & show leaderboard
function saveScore() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push(score);
    scores.sort((a, b) => b - a);
    if (scores.length > 5) scores = scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    displayLeaderboard();
}

function displayLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    scores.forEach((score, index) => {
        let li = document.createElement("li");
        li.innerText = `#${index + 1}: ${score}`;
        leaderboard.appendChild(li);
    });
}

window.addEventListener("beforeunload", saveScore);
displayLeaderboard();
