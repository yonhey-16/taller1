const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 15;
const canvasSize = 20;
let snake = [{ x: 9, y: 9 }];
let food = {
  x: Math.floor(Math.random() * canvasSize),
  y: Math.floor(Math.random() * canvasSize),
};
let direction = 'right';
let gameOver = false;

let score = 0;
let highScore = 0;

const recordElement = document.getElementById('record'); // Obtener el elemento correcto
const userElement = document.getElementById('current-user'); // Mostrar el usuario actual

// === Cargar récord desde Firebase ===
async function loadRecord() {
  try {
    const docRef = doc(db, "snake", "record");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      highScore = data.highScore || 0;
      recordElement.textContent = `🥇 Récord: ${highScore}`;
    } else {
      await setDoc(docRef, { highScore: 0 });
    }
  } catch (error) {
    console.error("Error al cargar el récord:", error);
  }
}

// === Guardar y actualizar récord en Firebase ===
async function saveRecord(newScore) {
  if (newScore > highScore) {
    highScore = newScore;
    await setDoc(doc(db, "snake", "record"), { highScore });
    recordElement.textContent = `🥇 Récord: ${highScore}`;
  }
}

// === Cambiar dirección desde botones o teclado ===
function changeDirection(dir) {
  if (dir === 'up' && direction !== 'down') direction = 'up';
  if (dir === 'down' && direction !== 'up') direction = 'down';
  if (dir === 'left' && direction !== 'right') direction = 'left';
  if (dir === 'right' && direction !== 'left') direction = 'right';
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') changeDirection('up');
  if (e.key === 'ArrowDown') changeDirection('down');
  if (e.key === 'ArrowLeft') changeDirection('left');
  if (e.key === 'ArrowRight') changeDirection('right');
});

// === Dibujar juego ===
function draw() {
  if (gameOver) return;

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * box, food.y * box, box, box);

  let head = { ...snake[0] };
  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;
  if (direction === 'left') head.x--;
  if (direction === 'right') head.x++;

  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver = true;
    saveRecord(score);
    alert("💀 Game Over!");
    location.reload();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('current-score').textContent = `🍎 Puntaje: ${score}`;

    // Si el puntaje actual supera el récord, lo actualizamos en pantalla
    if (score > highScore) {
      highScore = score;
      recordElement.textContent = `🥇 Récord: ${highScore}`;
    }

    food = {
      x: Math.floor(Math.random() * canvasSize),
      y: Math.floor(Math.random() * canvasSize),
    };
  } else {
    snake.pop();
  }

  ctx.fillStyle = 'lime';
  snake.forEach(s => {
    ctx.fillRect(s.x * box, s.y * box, box - 1, box - 1);
  });
}

// === Iniciar juego ===
loadRecord().then(() => {
  setInterval(draw, 100);
});

// === Función de autenticación con GitHub ===
async function signInWithGitHub() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Mostrar el nombre del usuario en la interfaz
    userElement.textContent = `Bienvenido, ${user.displayName}`;
    
    // Cargar el récord desde Firebase
    loadRecord();
  } catch (error) {
    console.error("Error al iniciar sesión con GitHub:", error.message);
  }
}

// === Función de cerrar sesión ===
function signOutUser() {
  signOut(auth).then(() => {
    userElement.textContent = "Usuario desconectado";
    console.log("Usuario cerrado sesión");
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error);
  });
}
