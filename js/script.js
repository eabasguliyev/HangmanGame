const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const notificationText = document.getElementById("notification-text");
const finalMessage = document.getElementById("final-message");
const hint = document.getElementById("hint");
const count = document.getElementById("count");

const figureParts = document.querySelectorAll(".figure-part");

let words = [];
let hintCount = 4;
let selectedWord = "";

let gameOver = false;
const correctLetters = [];
const wrongLetters = [];

// Get random word
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Show hidden word
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) =>
          `<span class='letter'>${
            correctLetters.includes(letter) ? letter : ""
          }</span>`
      )
      .join("")}`;

  const innerWord = word.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😀";
    popup.style.display = "flex";
    gameOver = true;
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong<p>" : ""} 
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join(", ")}
    `;

  // Display parts

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost. 😐";
    popup.style.display = "flex";
    gameOver = true;
  }
}

// Show notification
function showNotification(content) {
  notificationText.innerText = content;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Get Words from API
async function getWords() {
  const apiUrl = "https://random-word-api.herokuapp.com/word?number=100";

  const resp = await fetch(apiUrl);
  const json = await resp.json();

  return json.filter((word) => word.length >= 6);
}

// Keydown letter press
window.addEventListener("keydown", (e) => {
  //   console.log(e.keyCode);

  if (!gameOver && e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    const text = "You have already entered this letter";
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification(text);
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification(text);
      }
    }
  }
});

// Show hint
hint.addEventListener("click", () => {
  if (hintCount == 0) {
    showNotification("There is no hint left");
    return;
  }

  hintCount--;

  let letter = "";

  do {
    letter = selectedWord[Math.floor(Math.random() * selectedWord.length)];
  } while (correctLetters.includes(letter));

  correctLetters.push(letter);
  displayWord();
  count.innerText = hintCount;
});

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = getRandomWord();

  displayWord();
  updateWrongLettersEl();

  hintCount = 4;
  gameOver = false;
  count.innerText = hintCount;
  popup.style.display = "none";
});

(async () => {
  words = await getWords();

  selectedWord = getRandomWord();
  displayWord();
})();
