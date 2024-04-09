var character = document.getElementById("character");
var block = document.getElementById("block");
var counter = 0;
var timer1 = 0;
var counter1 = 0;
var numberToCompare = 10;
var numberToGrow = 30;
var finalscore = 0;
var gam = document.getElementById("game");

function jump() {
    if (character.classList == "animate") {
        return;
    }
    character.classList.add("animate");
    setTimeout(function () {
        character.classList.remove("animate");
    }, 300);
    object.onkeypress = function () {
        jump()
    };
}


function updateScore() {
    var highscore = localStorage.getItem("highScore");
    var currentScore = Math.floor(counter / 100);
    if (!highscore || currentScore > highscore) {
        localStorage.setItem("highScore", currentScore);
        document.getElementById("highScore").innerText = currentScore;
    }
}



// Function to initialize the page
function init() {
    // Get the high score from localStorage and display it
    var highScore = localStorage.getItem("highScore");
    if (highScore) {
        finalscore = parseInt(highScore);
        document.getElementById("highScore").innerText = highScore;
    }
}


// Call the init function when the page loads
window.onload = init;




var checkDead = setInterval(function () {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    let blockTop = parseInt(window.getComputedStyle(block).getPropertyValue("top"));
    if (blockLeft < 50 && blockLeft > -50 && characterTop >= 130 || blockLeft < 50 && blockLeft > -50 && blockTop <= 100 && characterTop >= 100) {
        block.style.animation = "none";
        alert("Game Over. score: " + Math.floor(counter / 100));
        finalscore = Math.floor(counter / 100);
        counter = 0;
        timer1 = 0;
        block.style.height = '20px';
        block.style.animation = "block 1s infinite linear";
        gam.style.backgroundImage = "url('Background.png')";
    } else {
        counter++;
        updateScore();
        updateBackground();
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter / 100);
        document.getElementById("ScoreBoard").textContent = finalscore;

        
    //Geschwindigkeit ändern
        if (Math.floor(counter / 100) > numberToCompare) {
            block.style.animation = "block 0.5s infinite linear";
        } else {
            block.style.animation = "block 1s infinite linear";
        }


        if (Math.floor(counter / 100) > numberToCompare && Math.floor(counter / 100) > numberToGrow) {
            block.style.animation = "block 0.7s infinite linear";
        } 

    
    //Blockposition anpassen
        if (Math.floor(counter / 100) > numberToCompare) {
            block.style.top = "90px";
        } else {
            block.style.top = "120px";
        }


    //Blockgröße ändern
        if (Math.floor(counter / 100) > numberToCompare) {
            block.style.height = '50px';
        } else {
            block.style.height = '20px';
        }
    }
}, 10);


    function updateBackground() {
        if (Math.floor(counter / 100) > numberToCompare) {
            gam.style.backgroundImage = "url('Background3.png')";
        }

        if (Math.floor(counter / 100) > numberToCompare && Math.floor(counter / 100) > numberToGrow) {
            gam.style.backgroundImage = "url('Background.png')";
        } 
    }


        function updateTimer() {
            timer1++;
            document.getElementById("Timer").innerHTML = timer1;
        }

        timerInterval = setInterval(updateTimer, 1000);


