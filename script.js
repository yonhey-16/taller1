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
    alert("💀 Game Over!");
    location.reload();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
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

setInterval(draw, 100);
