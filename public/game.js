const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let fallingLetters = [];
let score = 0;

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

document.addEventListener('keydown', shootLetter);

function gameLoop() {
  drawLetters();
  if (Math.random() < 0.05) {
    createFallingLetter();
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
