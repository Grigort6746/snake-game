const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const currentScoreElement = document.getElementById("current-score");
const bestScoreElement = document.getElementById("best-score");
const topPlayersList = document.getElementById("top-players");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let topPlayers = JSON.parse(localStorage.getItem("topPlayers")) || [];

// Обновляем лучший счёт и топ игроков
bestScoreElement.textContent = bestScore;
updateLeaderboard();

// Отрисовка игры
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

// Обновление состояния игры
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Проверка на столкновение с границами
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    // Проверка на столкновение с собой
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    // Добавление новой головы
    snake.unshift(head);

    // Проверка на съедание еды
    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
}

// Отрисовка игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка змейки
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

    // Отрисовка еды
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Размещение еды
function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

// Сброс игры
function resetGame() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        bestScoreElement.textContent = bestScore;
    }

    const playerName = prompt("Введите ваше имя:");
    if (playerName) {
        topPlayers.push({ name: playerName, score: score });
        topPlayers.sort((a, b) => b.score - a.score);
        topPlayers = topPlayers.slice(0, 5);
        localStorage.setItem("topPlayers", JSON.stringify(topPlayers));
        updateLeaderboard();
    }

    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    currentScoreElement.textContent = score;
    placeFood();
}

// Обновление таблицы лидеров
function updateLeaderboard() {
    topPlayersList.innerHTML = topPlayers
        .map((player, index) => `<li>${index + 1}. ${player.name} - ${player.score}</li>`)
        .join("");
}

// Управление с клавиатуры
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Управление с кнопок
document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -1 };
});
document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: 1 };
});
document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -1, y: 0 };
});
document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: 1, y: 0 };
});

// Запуск игры
placeFood();
gameLoop();