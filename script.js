const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const canvas = document.getElementById('hangman-canvas');
const ctx = canvas.getContext('2d');
const timerElement = document.getElementById('timer');
const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');

const words = ['JUEGO', 'CODIGO', 'AHORCADO', 'DESARROLLO', 'PROGRAMACION', 'WEB', 'SOFTWARE'];
let chosenWord;
let guessedWord;
let wrongGuesses = 0;
let timer = 60;
let interval;

// Dibujar el monito poco a poco
function drawHangman(stage) {
  switch (stage) {
    case 1:
      ctx.moveTo(150, 350); ctx.lineTo(150, 50); ctx.stroke(); // Poste
      break;
    case 2:
      ctx.moveTo(150, 50); ctx.lineTo(200, 50); ctx.stroke(); // Viga
      break;
    case 3:
      ctx.moveTo(200, 50); ctx.lineTo(200, 80); ctx.stroke(); // Soga
      break;
    case 4:
      ctx.beginPath(); ctx.arc(200, 100, 20, 0, Math.PI * 2); ctx.stroke(); // Cabeza
      break;
    case 5:
      ctx.moveTo(200, 120); ctx.lineTo(200, 200); ctx.stroke(); // Cuerpo
      break;
    case 6:
      ctx.moveTo(200, 140); ctx.lineTo(180, 170); ctx.stroke(); // Brazo izquierdo
      break;
    case 7:
      ctx.moveTo(200, 140); ctx.lineTo(220, 170); ctx.stroke(); // Brazo derecho
      break;
    case 8:
      ctx.moveTo(200, 200); ctx.lineTo(180, 230); ctx.stroke(); // Pierna izquierda
      break;
    case 9:
      ctx.moveTo(200, 200); ctx.lineTo(220, 230); ctx.stroke(); // Pierna derecha
      break;
  }
}

// Iniciar el juego
startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
});

// Inicializar el juego
function startGame() {
  chosenWord = words[Math.floor(Math.random() * words.length)];
  guessedWord = '_ '.repeat(chosenWord.length).trim();
  wordDisplay.textContent = guessedWord;
  drawKeyboard();
  startTimer();
}

// Dibujar el teclado
function drawKeyboard() {
  const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  keyboard.innerHTML = '';
  letters.split('').forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleGuess(letter, button));
    keyboard.appendChild(button);
  });
}

// Manejar intento del jugador
function handleGuess(letter, button) {
  button.disabled = true;
  if (chosenWord.includes(letter)) {
    updateGuessedWord(letter);
  } else {
    wrongGuesses++;
    drawHangman(wrongGuesses);
    if (wrongGuesses === 9) endGame(false);
  }
}


// Agregar el evento global para el teclado físico
document.addEventListener('keydown', (event) => {
    const letter = event.key.toUpperCase(); // Convertir a mayúsculas
    if (/^[A-ZÑ]$/.test(letter)) { // Verificar si es una letra válida
      const button = Array.from(keyboard.children).find(btn => btn.textContent === letter);
      if (button && !button.disabled) {
        button.click(); // Simula el clic en el botón
      }
    }
  });
  


// Actualizar palabra adivinada
function updateGuessedWord(letter) {
  let newGuessedWord = '';
  for (let i = 0; i < chosenWord.length; i++) {
    newGuessedWord += chosenWord[i] === letter ? letter : guessedWord[i * 2];
  }
  guessedWord = newGuessedWord.split('').join(' ');
  wordDisplay.textContent = guessedWord;
  if (!guessedWord.includes('_')) endGame(true);
}

// Iniciar cronómetro
function startTimer() {
  interval = setInterval(() => {
    timer--;
    timerElement.textContent = `Tiempo: ${timer}s`;
    if (timer === 0) endGame(false);
  }, 1000);
}

// Terminar el juego
function endGame(win) {
  clearInterval(interval);
  alert(win ? '¡Ganaste!' : '¡Perdiste! La palabra era: ' + chosenWord);
  location.reload();
}
