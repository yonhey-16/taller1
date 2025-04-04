let score = 0;
let highScore = 0;

async function loadRecord() {
  const docRef = doc(db, "snake", "record");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    highScore = docSnap.data().highScore || 0;
    document.getElementById('record').textContent = `🥇 Récord: ${highScore}`;
  } else {
    await setDoc(docRef, { highScore: 0 });
  }
}

async function saveRecord(newScore) {
  if (newScore > highScore) {
    highScore = newScore;
    await setDoc(doc(db, "snake", "record"), { highScore });
    document.getElementById('record').textContent = `🥇 Récord: ${highScore}`;
  }
}

loadRecord(); // cargar al iniciar el juego

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
    saveRecord(score); // guarda récord si corresponde
    alert("💀 Game Over!");
    location.reload();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
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
