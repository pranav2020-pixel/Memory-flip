const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;
let totalPairs;
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
let time = 0;
let timerInterval = null;
let timerStarted = false;

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("time").textContent = time;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

document.querySelector(".score").textContent = score;

fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cards = [...data, ...data]; // duplicate for pairs
    totalPairs = cards.length / 2;
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  cards.sort(() => 0.5 - Math.random());
}

function generateCards() {
  gridContainer.innerHTML = "";
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  startTimer();
  if (lockBoard) return;
  if (this === firstCard) return;

  flipSound.currentTime = 0;
  flipSound.play();

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchSound.currentTime = 0;
  matchSound.play();
  matchedPairs++;

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  if (matchedPairs === totalPairs) {
    stopTimer();
    setTimeout(() => {
      alert(`You won in ${time} seconds with ${score} moves!`);
    }, 500);
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  matchedPairs = 0;
  time = 0;
  timerStarted = false;
  document.querySelector(".score").textContent = score;
  document.getElementById("time").textContent = time;
  stopTimer();
  generateCards();

}
