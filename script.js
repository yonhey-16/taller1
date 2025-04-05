// Firebase configuración (reemplaza con tu propia configuración de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAzn1VrP1bY6h-kDbPD_6hbR1SmjNUWzKA",
    authDomain: "taller1-e4a59.firebaseapp.com",
    projectId: "taller1-e4a59",
    storageBucket: "taller1-e4a59.firebasestorage.app",
    messagingSenderId: "989644443398",
    appId: "1:989644443398:web:d91e2e513a481533cb1887"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Variables globales
let snakeColor = "#00ff00";
let bgColor = "#000000";
let gameInterval = null; // Para evitar múltiples intervalos
let record = 0;

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

// Definir el tamaño de la casilla y tamaño del canvas
const tileSize = 20;
const canvasSize = Math.min(window.innerWidth * 0.9, 400);
canvas.width = canvasSize;
canvas.height = canvasSize;

// Obtener el récord desde Firebase al iniciar el juego
function getRecordFromFirebase() {
    const recordRef = database.ref("record");
    recordRef.once('value').then(snapshot => {
        const storedRecord = snapshot.val();
        if (storedRecord) {
            record = storedRecord;
        }
    });
}

// Guardar el récord en Firebase
function saveRecordToFirebase(newRecord) {
    const recordRef = database.ref("record");
    recordRef.set(newRecord);
}

getRecordFromFirebase(); // Cargar el récord al iniciar

// Lógica del juego
let snake = [{ x: tileSize * 5, y: tileSize * 5 }];
let food = generateFood();
let direction = { x: 0, y: 0 };
let newDirection = { x: 0, y: 0 };
let gameRunning = false;
let applesEaten = 0;

// Botón "Jugar" en el menú principal
playButton.addEventListener("click", function () {
    mainMenu.style.display = "none";
    startGame();
});

// Botón "Personalizar"
customizeButton.addEventListener("click", function () {
    mainMenu.style.display = "none";
    menu.style.display = "block";
});

// Botón "Jugar" en el menú de personalización
startGameButton.addEventListener("click", function () {
    snakeColor = snakeColorInput.value;
    bgColor = bgColorInput.value;
    menu.style.display = "none";
    startGame();
});

// Función para iniciar el juego
function startGame() {
    canvas.style.display = "block"; // Mostrar el canvas del juego
    controls.style.display = "flex"; // Mostrar los controles
    gameRunning = true;
    snake = [{ x: tileSize * 5, y: tileSize * 5 }];
    direction = { x: 1, y: 0 };
    newDirection = direction;
    applesEaten = 0;
    food = generateFood();
    
    clearInterval(gameInterval);

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const speed = isMobile ? 180 : 120; 

    gameInterval = setInterval(updateGame, speed);
    document.addEventListener("keydown", changeDirection);
    drawGame();
}

document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) newDirection = { x: 0, y: -1 };
});
document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) newDirection = { x: 0, y: 1 };
});
document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) newDirection = { x: -1, y: 0 };
});
document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) newDirection = { x: 1, y: 0 };
});

function updateGame() {
    if (!gameRunning) return;

    direction = newDirection;
    if (direction.x === 0 && direction.y === 0) return;

    let head = {
        x: snake[0].x + direction.x * tileSize,
        y: snake[0].y + direction.y * tileSize
    };

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
        gameOver();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        applesEaten++;
        if (applesEaten > record) {
            record = applesEaten;
            saveRecordToFirebase(record);
        }
    } else {
        snake.pop();
    }

    snake.unshift(head);
    drawGame();
}

// Dibujar el juego (manzana como círculo)
function drawGame() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la manzana como un círculo
    const appleSize = tileSize * 1.5;
    ctx.beginPath();
    ctx.arc(food.x + tileSize / 2, food.y + tileSize / 2, appleSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "red"; // Color de la manzana
    ctx.fill();
    ctx.closePath();

    // Dibujar la serpiente
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "yellow" : snakeColor;
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });

    // Mostrar el puntaje
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`🍏: ${applesEaten}  🎯 Récord: ${record}`, 10, 20);
}

// Cambiar la dirección de la serpiente
function changeDirection(event) {
    const key = event.key.toLowerCase();
    
    if ((key === "arrowup" || key === "w") && direction.y === 0) {
        newDirection = { x: 0, y: -1 };
    }
    if ((key === "arrowdown" || key === "s") && direction.y === 0) {
        newDirection = { x: 0, y: 1 };
    }
    if ((key === "arrowleft" || key === "a") && direction.x === 0) {
        newDirection = { x: -1, y: 0 };
    }
    if ((key === "arrowright" || key === "d") && direction.x === 0) {
        newDirection = { x: 1, y: 0 };
    }
}

// Generar nueva comida (manzana)
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize,
        y: Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize
    };
}

// Verificar si la serpiente colisiona consigo misma
function snakeCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Fin del juego
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert(`¡Epaaaaaa! 🍏 Comiste ${applesEaten} manzanas. 🎯 Récord: ${record}`);
    location.reload();
}
