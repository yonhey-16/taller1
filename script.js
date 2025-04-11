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

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Variables del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
let snake = [{ x: 2, y: 2 }];
let direction = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let highScore = 0;
let gameInterval;

// Ajustar el tamaño del canvas
canvas.width = 400;
canvas.height = 400;

// Función para dibujar el juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la serpiente
  ctx.fillStyle = 'lime';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Dibujar la comida
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Actualizar la puntuación
  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
}

// Función para actualizar la posición de la serpiente
function update() {
  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  // Verificar colisiones con los bordes
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    return endGame();
  }

  // Verificar colisiones con el cuerpo
  if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
    return endGame();
  }

  // Agregar la nueva cabeza al principio del arreglo
  snake.unshift(head);

  // Verificar si la serpiente come la comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    spawnFood();
    updateHighScore();
  } else {
    // Eliminar el último segmento de la serpiente
    snake.pop();
  }

  draw();
}

// Función para generar comida en una posición aleatoria
function spawnFood() {
  food.x = Math.floor(Math.random() * (canvas.width / gridSize));
  food.y = Math.floor(Math.random() * (canvas.height / gridSize));
}

// Función para finalizar el juego
function endGame() {
  clearInterval(gameInterval);
  alert('Juego terminado. Tu puntuación fue ' + score);
  saveHighScore();
  resetGame();
}

// Función para guardar la puntuación más alta en Firebase
function saveHighScore() {
  const highScoreRef = database.ref('highScore');
  highScoreRef.set(highScore);
}

// Función para actualizar la puntuación más alta
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
  }
}

// Función para reiniciar el juego
function resetGame() {
  snake = [{ x: 2, y: 2 }];
  direction = { x: 1, y: 0 };
  food = { x: 5, y: 5 };
  score = 0;
  scoreElement.textContent = score;
  gameInterval = setInterval(update, 100);
}

// Función para manejar los controles táctiles en dispositivos móviles
function handleTouchMove(event) {
  const touch = event.touches[0];
  const x = touch.clientX - canvas.offsetLeft;
  const
::contentReference[oaicite:0]{index=0}
 
