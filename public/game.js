const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let fallingLetters = [];
let score = 0;

const ship = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  speed: 0,
  acceleration: 0.5,
  maxSpeed: 10
};

let targetWord = '';
let wordVisible = false;
let bullets = [];
let hitLetters = [];

function getRandomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

function getRandomWord() {
  const words = ['HELLO', 'WORLD', 'JAVASCRIPT', 'GAME', 'CANVAS'];
  return words[Math.floor(Math.random() * words.length)];
}

function createFallingLetter() {
  const x = Math.floor(Math.random() * (canvas.width - 20));
  fallingLetters.push({ letter: getRandomLetter(), x: x, y: 0 });
}

function drawLetters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  fallingLetters.forEach((letterObj, index) => {
    ctx.fillText(letterObj.letter, letterObj.x, letterObj.y);
    letterObj.y += 2;
    if (letterObj.y > canvas.height) {
      fallingLetters.splice(index, 1);
    }
  });
}

function drawShip() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach((bullet, index) => {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

function drawTargetWord() {
  if (wordVisible) {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    let displayWord = '';
    for (let i = 0; i < targetWord.length; i++) {
      if (hitLetters.includes(targetWord[i])) {
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = 'red';
      }
      displayWord += targetWord[i];
    }
    ctx.fillText(displayWord, canvas.width / 2 - ctx.measureText(displayWord).width / 2, canvas.height / 2);
  }
}

function moveShip(event) {
  if (event.key === 'ArrowLeft') {
    ship.speed = Math.max(ship.speed - ship.acceleration, -ship.maxSpeed);
  } else if (event.key === 'ArrowRight') {
    ship.speed = Math.min(ship.speed + ship.acceleration, ship.maxSpeed);
  }
}

function stopShip(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    ship.speed *= 0.9; // Apply friction to gradually stop the ship
  }
}

function shootBullet() {
  bullets.push({ x: ship.x + ship.width / 2, y: ship.y, speed: 5 });
}

function shootLetter(event) {
  if (event.key === ' ') {
    shootBullet();
  }
}

function showWord() {
  targetWord = getRandomWord();
  wordVisible = true;
  hitLetters = [];
  setTimeout(() => {
    wordVisible = false;
  }, 2000);
}

function checkCollision() {
  fallingLetters.forEach(letterObj => {
    if (
      letterObj.x < ship.x + ship.width &&
      letterObj.x + 20 > ship.x &&
      letterObj.y < ship.y + ship.height &&
      letterObj.y + 20 > ship.y
    ) {
      alert('Game Over!');
      document.location.reload();
    }
  });
}

function checkBulletCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    fallingLetters.forEach((letterObj, letterIndex) => {
      if (
        bullet.x > letterObj.x &&
        bullet.x < letterObj.x + 20 &&
        bullet.y > letterObj.y &&
        bullet.y < letterObj.y + 20
      ) {
        fallingLetters.splice(letterIndex, 1);
        bullets.splice(bulletIndex, 1);
        score++;
        if (targetWord.includes(letterObj.letter)) {
          hitLetters.push(letterObj.letter);
          if (hitLetters.length === targetWord.length) {
            alert('You completed the word!');
            showWord();
          }
        }
      }
    });
  });
}

document.addEventListener('keydown', moveShip);
document.addEventListener('keyup', stopShip);
document.addEventListener('keydown', shootLetter);

function gameLoop() {
  drawLetters();
  drawShip();
  drawBullets();
  drawTargetWord();
  checkCollision();
  checkBulletCollision();
  ship.x += ship.speed;
  if (Math.random() < 0.05) {
    createFallingLetter();
  }
  if (!wordVisible && Math.random() < 0.01) {
    showWord();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
