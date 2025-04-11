// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzn1VrP1bY6h-kDbPD_6hbR1SmjNUWzKA",
    authDomain: "taller1-e4a59.firebaseapp.com",
    databaseURL: "https://taller1-e4a59-default-rtdb.firebaseio.com",
    projectId: "taller1-e4a59",
    storageBucket: "taller1-e4a59.appspot.com",
    messagingSenderId: "989644443398",
    appId: "1:989644443398:web:d91e2e513a481533cb1887"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const mainMenu = document.getElementById("mainMenu");
    const menu = document.getElementById("menu");
    const controls = document.querySelector(".controls");
    const playButton = document.getElementById("playButton");
    const customizeButton = document.getElementById("customizeButton");
    const startGameButton = document.getElementById("startGameButton");
    const snakeColorInput = document.getElementById("snakeColor");
    const bgColorInput = document.getElementById("bgColor");

    let snakeColor = "#00ff00";
    let bgColor = "#000000";

    let snake = [];
    let direction = "right";
    let food = {};
    let score = 0;
    let bestScore = 0;
    let gameInterval;

    // Crear elementos de puntuación
    const scoreDisplay = document.createElement("div");
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px";
    scoreDisplay.style.right = "10px";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "20px";
    document.body.appendChild(scoreDisplay);

    function drawGame() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar serpiente
        ctx.fillStyle = snakeColor;
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, 20, 20);
        });

        // Dibujar comida
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, 20, 20);

        // Mostrar puntaje
        scoreDisplay.innerText = `Puntaje: ${score} | Récord: ${bestScore}`;
    }

    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === "right") head.x += 20;
        if (direction === "left") head.x -= 20;
        if (direction === "up") head.y -= 20;
        if (direction === "down") head.y += 20;

        // Colisión con paredes o con el cuerpo
        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height ||
            snake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            endGame();
            return;
        }

        snake.unshift(head);

        // Comer comida
        if (head.x === food.x && head.y === food.y) {
            score++;
            placeFood();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
        };
    }

    function startGame() {
        canvas.width = 400;
        canvas.height = 400;
        mainMenu.style.display = "none";
        menu.style.display = "none";
        canvas.style.display = "block";
        controls.style.display = "flex";
        score = 0;
        direction = "right";
        snake = [{ x: 200, y: 200 }];
        placeFood();
        getBestScore();
        gameInterval = setInterval(moveSnake, 150);
    }

    function endGame() {
        clearInterval(gameInterval);
        if (score > bestScore) {
            saveBestScore(score);
        }
        alert(`¡Fin del juego! Puntaje: ${score}`);
        canvas.style.display = "none";
        controls.style.display = "none";
        mainMenu.style.display = "block";
    }

    function getBestScore() {
        db.ref("record").once("value").then(snapshot => {
            bestScore = snapshot.val() || 0;
        });
    }

    function saveBestScore(score) {
        db.ref("record").set(score);
    }

    // Eventos del menú
    playButton.addEventListener("click", startGame);

    customizeButton.addEventListener("click", function () {
        mainMenu.style.display = "none";
        menu.style.display = "block";
    });

    startGameButton.addEventListener("click", function () {
        snakeColor = snakeColorInput.value;
        bgColor = bgColorInput.value;
        startGame();
    });

    // Eventos de teclado
    document.addEventListener("keydown", function (e) {
        const key = e.key;
        if (key === "ArrowUp" && direction !== "down") direction = "up";
        if (key === "ArrowDown" && direction !== "up") direction = "down";
        if (key === "ArrowLeft" && direction !== "right") direction = "left";
        if (key === "ArrowRight" && direction !== "left") direction = "right";
    });

    // Controles móviles
    document.getElementById("up").addEventListener("click", () => { if (direction !== "down") direction = "up"; });
    document.getElementById("down").addEventListener("click", () => { if (direction !== "up") direction = "down"; });
    document.getElementById("left").addEventListener("click", () => { if (direction !== "right") direction = "left"; });
    document.getElementById("right").addEventListener("click", () => { if (direction !== "left") direction = "right"; });
});
