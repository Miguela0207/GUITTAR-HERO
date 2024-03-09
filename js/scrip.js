const strings = document.querySelectorAll('.string');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

const letters = ['a', 's', 'd', 'f'];
let gameStarted = false;

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);

function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    generateRandomNotes();
    moveNotes();
}

function pauseGame() {
    gameStarted = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function generateRandomNotes() {
    setInterval(() => {
        if (gameStarted) {
            const randomString = strings[Math.floor(Math.random() * strings.length)];
            const note = document.createElement('div');
            note.classList.add('note');
            note.style.left = `${Math.floor(Math.random() * 30)}px`;
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
          const letters = document.querySelectorAll('.note');
          letters.forEach(note => {
              const noteTop = parseInt(note.style.top || 0);
              const noteBottom = noteTop + note.clientHeight;
              const stringBottom = note.parentElement.clientHeight;

              
              if (noteBottom >= stringBottom) {
                  note.remove();
              } 
              
              else {
                  note.style.top = `${noteTop + 10}px`;
              } 
          });
      }
  }, 100);
}



document.addEventListener('keydown', (event) => {
    if (gameStarted) {
        const key = event.key.toLowerCase();
        const letterIndex = letters.indexOf(key);
        if (letterIndex !== -1) {
            const string = strings[letterIndex];
            const note = string.querySelector('.note');
            
            if (note) {
                note.remove();
                playSound(letterIndex);
            }
        }
    }
});

function playSound(letterIndex) {
    const sound = document.getElementById(`string${letters[letterIndex]}-sound`);
    sound.currentTime = 0;
    sound.play();
}

