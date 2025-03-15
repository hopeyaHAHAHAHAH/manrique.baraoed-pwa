const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeSize = 15;
const width = canvas.width;
const height = canvas.height;

let score = 0;
let snake = [{ x: 150, y: 150 }];
let direction = "RIGHT";
let food = generateFood();
let lastRenderTime = 0; // Keep track of the last render time for smoother animation

// Set the speed (frame rate control)
const frameRate = 15; // Higher value means slower speed

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" || event.key === "w") {
        if (direction !== "DOWN") direction = "UP";
    } else if (event.key === "ArrowDown" || event.key === "s") {
        if (direction !== "UP") direction = "DOWN";
    } else if (event.key === "ArrowLeft" || event.key === "a") {
        if (direction !== "RIGHT") direction = "LEFT";
    } else if (event.key === "ArrowRight" || event.key === "d") {
        if (direction !== "LEFT") direction = "RIGHT";
    }
}

function gameLoop(currentTime) {
    // Calculate the time difference from the last render to control game speed
    const deltaTime = currentTime - lastRenderTime;

    if (deltaTime > 1000 / frameRate) {
        lastRenderTime = currentTime; // Update the last render time

        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        updateScore();
    }

    requestAnimationFrame(gameLoop); // Continue the loop using requestAnimationFrame
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === "UP") head.y -= snakeSize;
    if (direction === "DOWN") head.y += snakeSize;
    if (direction === "LEFT") head.x -= snakeSize;
    if (direction === "RIGHT") head.x += snakeSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        // If it's special food, add 5 points; else add 1 point
        score += food.points;

        // Add new segment based on the score
        for (let i = 0; i < food.points; i++) {
            snake.push({ x: -1, y: -1 });  // Add segments for each point gained
        }

        food = generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment) => {
        ctx.beginPath();
        ctx.fillStyle = "green"; // Snake body color
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize); // Draw rectangle segments
        ctx.closePath();
    });
}

function drawFood() {
    ctx.beginPath();
    if (food.isSpecial) {
        // Draw special food (e.g., blue color)
        ctx.arc(food.x + snakeSize / 2, food.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "blue"; // Special food color
    } else {
        // Draw normal food (red color)
        ctx.arc(food.x + snakeSize / 2, food.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "red"; // Normal food color
    }
    ctx.fill();
    ctx.closePath();
}

function generateFood() {
    const x = Math.floor(Math.random() * (width / snakeSize)) * snakeSize;
    const y = Math.floor(Math.random() * (height / snakeSize)) * snakeSize;
    
    // 10% chance to generate special food
    const isSpecial = Math.random() < 0.2;  // 10% chance
    
    return {
        x,
        y,
        isSpecial, // Flag to indicate if it's special food
        points: isSpecial ? 5 : 1 // Special food gives 5 points, else normal food gives 1 point
    };
}


function checkGameOver() {
    const head = snake[0];

    if (
        head.x < 0 ||
        head.x >= width ||
        head.y < 0 ||
        head.y >= height ||
        snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
        alert("Game Over! Your score is: " + score);
        resetGame();
    }
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function resetGame() {
    snake = [{ x: 150, y: 150 }];
    direction = "RIGHT";
    score = 0;
    food = generateFood();
}

requestAnimationFrame(gameLoop); // Start the game loop
