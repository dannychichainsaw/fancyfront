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
  speed: 5
};

function getRandomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
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

function moveShip(event) {
  if (event.key === 'ArrowLeft' && ship.x > 0) {
    ship.x -= ship.speed;
  } else if (event.key === 'ArrowRight' && ship.x < canvas.width - ship.width) {
    ship.x += ship.speed;
  }
}

function shootLetter(event) {
  const shotLetter = String.fromCharCode(event.keyCode);
  fallingLetters = fallingLetters.filter(letterObj => {
    if (letterObj.letter === shotLetter) {
      score++;
      return false;
    }
    return true;
  });
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

document.addEventListener('keydown', moveShip);
document.addEventListener('keydown', shootLetter);

function gameLoop() {
  drawLetters();
  drawShip();
  checkCollision();
  if (Math.random() < 0.05) {
    createFallingLetter();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
