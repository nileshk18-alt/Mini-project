const gameSeq = [];
const userSeq = [];

const colors = ["red", "yellow", "green", "purple"];
const keyMap = {
    "1": "red",
    "2": "yellow",
    "3": "green",
    "4": "purple"
};

let started = false;
let acceptingInput = false;
let level = 0;
let highScore = Number(localStorage.getItem("simonHighScore")) || 0;

const levelEl = document.querySelector("#level");
const highScoreEl = document.querySelector("#high-score");
const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const startBtn = document.querySelector("#start-btn");
const gameCard = document.querySelector(".game-card");
const allBtns = document.querySelectorAll(".btn");

highScoreEl.textContent = highScore;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getButton(color) {
    return document.querySelector(`#${color}`);
}

function flashButton(button, className = "flash", duration = 350) {
    button.classList.add(className);
    setTimeout(() => button.classList.remove(className), duration);
}

function updateScore() {
    levelEl.textContent = level;
    if (level > highScore) {
        highScore = level;
        highScoreEl.textContent = highScore;
        localStorage.setItem("simonHighScore", highScore);
    }
}

function startGame() {
    gameSeq.length = 0;
    userSeq.length = 0;
    level = 0;
    started = true;
    acceptingInput = false;

    gameCard.classList.remove("game-over");
    startBtn.textContent = "Restart";
    statusEl.textContent = "Memorize the pattern";
    messageEl.textContent = "Get ready...";
    updateScore();

    setTimeout(levelUp, 500);
}

async function levelUp() {
    userSeq.length = 0;
    level++;
    updateScore();

    statusEl.textContent = `Level ${level}`;
    messageEl.textContent = "Watch the sequence...";

    const randomIndex = Math.floor(Math.random() * colors.length);
    gameSeq.push(colors[randomIndex]);

    acceptingInput = false;

    // Replay the complete pattern every round.
    for (const color of gameSeq) {
        await sleep(250);
        flashButton(getButton(color));
        await sleep(300);
    }

    acceptingInput = true;
    messageEl.textContent = "Your turn!";
}

function checkAnswer(index) {
    if (userSeq[index] !== gameSeq[index]) {
        gameOver();
        return;
    }

    if (userSeq.length === gameSeq.length) {
        acceptingInput = false;
        messageEl.textContent = "Perfect! Next level...";
        setTimeout(levelUp, 850);
    }
}

function handleButtonPress(color) {
    if (!started || !acceptingInput) return;

    const button = getButton(color);
    flashButton(button, "userflash", 180);

    userSeq.push(color);
    checkAnswer(userSeq.length - 1);
}

function gameOver() {
    acceptingInput = false;
    started = false;

    gameCard.classList.add("game-over");
    statusEl.textContent = "Game Over";
    messageEl.innerHTML = `You reached <strong>Level ${level}</strong>. Try to beat your best!`;
    startBtn.textContent = "Play Again";

    if (level > highScore) {
        highScore = level;
        highScoreEl.textContent = highScore;
        localStorage.setItem("simonHighScore", highScore);
    }

    setTimeout(() => gameCard.classList.remove("game-over"), 400);
}

startBtn.addEventListener("click", startGame);

allBtns.forEach(button => {
    button.addEventListener("click", () => {
        handleButtonPress(button.dataset.color);
    });
});

document.addEventListener("keydown", event => {
    if (keyMap[event.key]) {
        event.preventDefault();
        handleButtonPress(keyMap[event.key]);
    }

    if (event.code === "Space" || event.key === "Enter") {
        if (!started) startGame();
    }
});
