let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

// ✅ Load the raptor sprite sheet
let dinoSprite = new Image();
dinoSprite.src = "raptor_sprite_sheet.png";  // make sure this matches your filename!

// ✅ Dino animation state
const frameWidth = 128;
const frameHeight = 128;
const totalFrames = 8;

let currentFrame = 0;
let frameTimer = 0;
const frameDelay = 5; // smaller = faster animation

// ✅ Your dino setup
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
let score = 0;
let gameOver = false;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !dino.isJumping) {
        dino.isJumping = true;
        dino.y -= dino.jumpHeight;
    }
});

function spawnObstacle() {
    let obstacle = {
        x: canvas.width,
        y: 200,
        width: 20 + Math.random() * 30,
        height: 30 + Math.random() * 30
    };
    obstacles.push(obstacle);
}

function drawDino() {
    // Animate the sprite
    frameTimer++;
    if (frameTimer >= frameDelay) {
        frameTimer = 0;
        currentFrame = (currentFrame + 1) % totalFrames;
    }

    // Draw the current frame from sprite sheet
    ctx.drawImage(
        dinoSprite,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        dino.x, dino.y,
        dino.width, dino.height
    );
}

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

    drawDino(); // ✅ use your new animation function

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= dino.speed;
        ctx.fillStyle = "brown";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        if (dino.x + dino.width > obstacle.x && dino.x < obstacle.x + obstacle.width && dino.y + dino.height > obstacle.y) {
            gameOver = true;
        }
    });

    document.getElementById("score").innerText = `Score: ${score}`;
    requestAnimationFrame(update);
}

setInterval(spawnObstacle, 2000);
update();

// Save score to localStorage
function saveScore() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push(score);
    scores.sort((a, b) => b - a);
    if (scores.length > 5) scores = scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    displayLeaderboard();
}

// Display leaderboard
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
