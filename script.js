// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define game variables
let characterY = 300;
let characterHeight = 30; // Adjusted for better collision detection
let blockY = 290;
let isJumping = false;
let score = 0;
let highscore = localStorage.getItem("highScore");
let timer = 0;
let enemies = []; // Array to store enemies
let isEnemySpawning = false; // Variable to track if an enemy is spawning
let collided = false;
let isFirstEnemySpawned = false;
let gamepaused = false;

// Function to draw everything
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw character
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(50, characterY, 30, characterHeight);

    // Draw enemies
    ctx.fillStyle = '#FF0000';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, 30, 30);
    });
}

// Function to update the timer
function updateTimer() {
    // Increment timer by one second
    timer++; // Assuming the game loop runs at 60 frames per second
    let seconds = Math.floor(timer / 60); // Convert frames to seconds (assuming 60 frames per second)
    document.getElementById('timerSpan').textContent = seconds;
}

function updateHighscore() {
    // Update high score
    if (score > highscore) {
        highscore = score || highscore;
        localStorage.setItem('highScore', score);
        document.getElementById('highScore').innerHTML = score;
    }
}

// Function to update game state
function update() {

    updateTimer();

    // Move the character
    moveCharacter();

    // Move and spawn enemies
    moveEnemies();

    // Check for collision
    checkCollision();

    updateHighscore();

}

// Function to move the character
function moveCharacter() {
    // Move character logic goes here
}

// Function to move and spawn enemies
function moveEnemies() {
    // Move existing enemies
    enemies.forEach(enemy => {
        enemy.x -= enemy.speed; // Move based on enemy speed
    });

    // Remove enemies that have moved out of the canvas
    enemies = enemies.filter(enemy => enemy.x > -30);

    // Spawn new enemy if needed
    if (!isEnemySpawning && enemies.length === 0) {
        isEnemySpawning = true;
    }

    if (isEnemySpawning && enemies.length === 0 && !gamepaused) {
        let newEnemy = {
            x: canvas.width,
            y: Math.random() * (canvas.height * 0.6) + (canvas.height * 0.3), // Adjusted spawn height
            width: Math.random() * 30 + 20, // Random width between 20 and 50
            height: Math.random() * 30 + 20, // Random height between 20 and 50
            speed: Math.random() * 7 + 3 // Random speed between 2 and 7
        };
        enemies.push(newEnemy);
        isEnemySpawning = false;

        // Check if it's the first enemy spawn
        if (!isFirstEnemySpawned) {
            isFirstEnemySpawned = true;
        } else {
            // Increment score only when a new enemy spawns after the initial one
            score++;
            document.getElementById('scoreSpan').textContent = score;
            updateHighscore(); 
        }
    }
}




function checkCollision() {
    enemies.forEach(enemy => {
        // Check if the player's hitbox overlaps with the enemy's hitbox
        if (
            characterY + characterHeight > enemy.y && // Player's bottom edge is below enemy's top edge
            characterY < enemy.y + enemy.height && // Player's top edge is above enemy's bottom edge
            50 < enemy.x + enemy.width && // Player's right edge is to the left of enemy's right edge
            80 > enemy.x // Player's left edge is to the right of enemy's left edge
        ) {
            collided = true;
            gamepaused = true;
            endGame();
        }
    });
}

// Function to show game over menu
function showGameOverMenu() {
    // Set game state to paused
    gamepaused = true;

    // Create a <div> element for the game over menu
    const gameOverMenu = document.createElement('div');
    gameOverMenu.id = 'gameOverMenu';

    // Create a <label> element for the game over text
    const gameOverLabel = document.createElement('label');
    gameOverLabel.textContent = 'Game Over';
    gameOverLabel.style.display = 'block'; // Ensure the label is displayed as a block-level element
    gameOverLabel.style.marginBottom = '20px'; // Add some space below the label
    gameOverMenu.appendChild(gameOverLabel);

    // Create a <button> element for the restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', resetGame);
    gameOverMenu.appendChild(restartButton);

    // Append the <div> element to the document body
    document.body.appendChild(gameOverMenu);
}

// Function to remove game over menu
function removeGameOverMenu() {
    const gameOverMenu = document.getElementById('gameOverMenu');
    if (gameOverMenu) {
        gameOverMenu.parentNode.removeChild(gameOverMenu);
    }
}


// Function to end the game
function endGame() {
    /* alert('Game Over. Score: ' + score);
    resetGame(); */

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Show game over menu
    showGameOverMenu();
}




// Function to reset the game
function resetGame() {
    // Remove game over menu
    removeGameOverMenu();
    updateHighscore();

    // Reset player position
    characterY = 300;
    isJumping = false;

    // Check if highscore is not set in local storage
    if (localStorage.getItem("highScore") === null) {
        highscore = 0; // Set highscore to 0 if it's not set in local storage
    }

    /* highscore = 0; */
    score = 0;
    timer = 0;
    enemies = [];
    isEnemySpawning = false;
    collided = false;
    isFirstEnemySpawned = false;
    gamepaused = false;

    // Update score display
    document.getElementById('scoreSpan').textContent = score;
}

// Main game loop
function gameLoop() {
    if (!gamepaused) {
        update();
        draw();
    }
    requestAnimationFrame(gameLoop);
}
// Event listener for keyboard input
document.addEventListener('keydown', function(event) {
    if (!gamepaused && event.code === 'Space' && !isJumping) {
        isJumping = true;
        jump();
    }
});




// Function to handle jumping
function jump() {
    let jumpHeight = 280;
    let jumpDuration = 1500;
    let startTime = Date.now();
    let originalY = characterY; // Store the original Y position

    function jumpStep() {
        let elapsedTime = Date.now() - startTime;
        let progress = elapsedTime / jumpDuration;
        let newY = originalY - jumpHeight * (4 * progress - 4 * progress ** 2); // Quadratic motion equation
        
        if (newY > originalY) {
            newY = originalY; // Ensure the character doesn't go below the original position
        }

        characterY = newY;

        if (elapsedTime < jumpDuration) {
            requestAnimationFrame(jumpStep);
        } else {
            isJumping = false;
            // Reset characterY to original position
            characterY = originalY;
        }
    }

    requestAnimationFrame(jumpStep);
}


// Start the game loop
gameLoop();
