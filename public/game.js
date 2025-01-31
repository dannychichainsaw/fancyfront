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
  acceleration: 0.2,
  maxSpeed: 5
};

let targetWord = '';
let wordVisible = false;

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

function moveShip(event) {
  if (event.key === 'ArrowLeft') {
    ship.speed = Math.max(ship.speed - ship.acceleration, -ship.maxSpeed);
  } else if (event.key === 'ArrowRight') {
    ship.speed = Math.min(ship.speed + ship.acceleration, ship.maxSpeed);
  }
}

function stopShip(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    ship.speed = 0;
  }
}

function shootLetter(event) {
  if (event.key === ' ') {
    const shotLetter = getRandomLetter();
    fallingLetters = fallingLetters.filter(letterObj => {
      if (letterObj.letter === shotLetter) {
        score++;
        return false;
      }
      return true;
    });
    if (targetWord.includes(shotLetter)) {
      targetWord = targetWord.replace(shotLetter, '');
      if (targetWord.length === 0) {
        alert('You completed the word!');
        showWord();
      }
    }
  }
}

function showWord() {
  targetWord = getRandomWord();
  wordVisible = true;
  ctx.fillStyle = 'red';
  ctx.font = '40px Arial';
  ctx.fillText(targetWord, canvas.width / 2 - ctx.measureText(targetWord).width / 2, canvas.height / 2);
  setTimeout(() => {
    wordVisible = false;
    ctx.clearRect(canvas.width / 2 - ctx.measureText(targetWord).width / 2, canvas.height / 2 - 40, ctx.measureText(targetWord).width, 50);
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

document.addEventListener('keydown', moveShip);
document.addEventListener('keyup', stopShip);
document.addEventListener('keydown', shootLetter);

function gameLoop() {
  drawLetters();
  drawShip();
  checkCollision();
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
