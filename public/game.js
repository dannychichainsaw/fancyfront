const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const word = "HELLO";
const letters = [];
const bullets = [];
const player = { x: canvas.width / 2, y: canvas.height - 30, width: 20, height: 20 };

let score = 0;
let gameOver = false;

function initLetters() {
  for (let i = 0; i < word.length; i++) {
    letters.push({ char: word[i], x: 100 + i * 100, y: 50, width: 20, height: 20 });
  }
}

function drawPlayer() {
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLetters() {
  ctx.fillStyle = 'red';
  letters.forEach(letter => {
    ctx.fillText(letter.char, letter.x, letter.y);
  });
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function moveBullets() {
  bullets.forEach(bullet => {
    bullet.y -= 5;
  });
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    letters.forEach((letter, letterIndex) => {
      if (bullet.x < letter.x + letter.width &&
          bullet.x + bullet.width > letter.x &&
          bullet.y < letter.y + letter.height &&
          bullet.y + bullet.height > letter.y) {
        bullets.splice(bulletIndex, 1);
        letters.splice(letterIndex, 1);
        score++;
        if (score === word.length) {
          gameOver = true;
        }
      }
    });
  });
}

function update() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.fillText('You Win!', canvas.width / 2 - 50, canvas.height / 2);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawLetters();
  drawBullets();
  moveBullets();
  checkCollisions();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && player.x > 0) {
    player.x -= 10;
  } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
    player.x += 10;
  } else if (e.key === ' ') {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
  }
});

initLetters();
update();
