const strings = document.querySelectorAll('.string');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const scoreElement = document.getElementById('score');
const comboElement = document.getElementById('combo');

const letters = ['a', 's', 'd', 'f'];
let gameStarted = false;
let score = 0;
let combo = 0;

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);

const stringButtons = document.querySelectorAll('.string-button');

// Modifica la función startGame para habilitar/deshabilitar los botones
function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    score = 0;
    combo = 0;
    updateScore();
    updateCombo();
    generateRandomNotes();
    moveNotes();
}

function pauseGame() {
    gameStarted = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
}


function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateCombo() {
    comboElement.textContent = `Combo: ${combo}`;
}

function calculatePoints(combo) {
    // Puedes ajustar la lógica de puntuación según tus preferencias
    return combo * 10;
}



document.addEventListener('keydown', (event) => {
    
    if (gameStarted) {
        const key = event.key.toLowerCase();
        const letterIndex = letters.indexOf(key);

        if (letterIndex !== -1) {
            const string = strings[letterIndex];
            const note = string.querySelector('.note');
            const button = stringButtons[letterIndex];
            console.log(getButtonPosition (button)) ;

            if (note) {
                const noteTop = parseInt(note.style.top || 0);
                const noteHeight = parseInt(note.dataset.noteHeight);

                const buttonTop = button.offsetTop;
                const buttonHeight = button.offsetHeight;
                console.log("T ",buttonTop," H ",buttonHeight )

                // Verifica si la nota está en la misma posición que el botón
                if (
                    (noteTop >= buttonTop && noteTop <= buttonTop + buttonHeight) ||
                    (noteTop + noteHeight >= buttonTop && noteTop + noteHeight <= buttonTop + buttonHeight)
                ) {
                    note.remove();
                    playSound(letterIndex);

                    // Incrementa el puntaje y el combo
                    combo++;
                    score += calculatePoints(combo);
                    updateScore();
                    updateCombo();
                } else {
                    combo = 0;
                    updateCombo();
                }
            }

            // Agrega un estilo visual para indicar que se presionó la cuerda
            button.classList.add('string-button-pressed');
            setTimeout(() => {
                button.classList.remove('string-button-pressed');
            }, 100);
        }
    }
});
function generateRandomNotes() {
    setInterval(() => {
        if (gameStarted) {
            const randomString = strings[Math.floor(Math.random() * strings.length)];
            const note = document.createElement('div');
            note.classList.add('note');

            const letterIndex = letters.indexOf(randomString.dataset.letter);
            const noteColors = ['blue', 'green', 'yellow', 'purple', 'orange'];
            const randomColor = noteColors[letterIndex];

            note.style.backgroundColor = randomColor;
            note.style.left = '50%';  // Centra la nota horizontalmente
            note.style.transform = 'translateX(-50%)';  // Centra la nota horizontalmente

            // Almacena la posición inicial y la altura de la nota
            const initialPosition = randomString.getBoundingClientRect().top;
            const noteHeight = note.clientHeight;
            note.dataset.initialPosition = initialPosition;
            note.dataset.noteHeight = noteHeight;

            randomString.appendChild(note);
            setTimeout(() => {
                note.remove();
            }, 2000);
        }
    }, 1000);
}


function moveNotes() {
    setInterval(() => {
        if (gameStarted) {
            const notes = document.querySelectorAll('.note');
            notes.forEach(note => {
                const noteTop = parseInt(note.style.top || 0);
                const noteBottom = noteTop + note.clientHeight;
                const stringBottom = note.parentElement.clientHeight;
  
                if (noteBottom >= stringBottom) {
                    // La nota colisiona con el final de la cuerda
                    note.remove();
  
                    // Reinicia el combo
                    combo = 0;
                    updateCombo();
                } else {
                    note.style.top = `${noteTop + 10}px`;
                }
            });
        }
    }, 100);
  }
  

function playSound(letterIndex) {
    const sound = document.getElementById(`string${letters[letterIndex]}-sound`);
    sound.currentTime = 0;
    sound.play();
}

function getButtonPosition(button) {
    const rect = button.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    return {
        top: rect.top + scrollTop,
        bottom: rect.bottom + scrollTop
    };
}

// Ejemplo de uso:
const buttonElement = document.getElementById('tuBotonId'); // Reemplaza 'tuBotonId' con el ID real de tu botón
const buttonPosition = getButtonPosition(buttonElement);

console.log('Posición del botón - Parte Superior:', buttonPosition.top);
console.log('Posición del botón - Parte Inferior:', buttonPosition.bottom);
