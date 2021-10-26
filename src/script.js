let cards = Array.from(document.querySelectorAll(".memory-card"));
const gameBoard = document.querySelector(".memory-game");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let clickedCardCount = 0;
let matchedPairs = 0;
let startPressed = false;
// deal cards upon page load
window.addEventListener("DOMContentLoaded", (event) => {
  // console.log(cards);
  newDeal();
});
// Reset and Start Button will flip all cards back-face, reset all the variables, shuffle,
// append to screen, and start the timer at zero
document.getElementById("resetbutton").addEventListener("click", reset);
document.getElementById("startbutton").addEventListener("click", startButtonPress);
function startTimer() {
  timer.innerHTML = `${minute}mins ${second}secs`; //display on screen
  second++;
  if (second === 60) {
    minute++;
    second = 0;
  }
}
// timer display
const timer = document.getElementById("timerbutton");
let second = 0; // set intial time to zero
let minute = 0;
timer.innerHTML = `${minute}mins ${second}secs`;
let interval;
function startButtonPress() {
  if (!startPressed) {
    interval = setInterval(startTimer, 1000); // do the startTimer function every 1 second (1000ms)
    // run flipCard function upon card click
    cards.forEach((card) => card.addEventListener("click", flipCard));
    startPressed = true;
  }
}
// flip card by toggling hidden class on images
// check for match when two cards are flipped up
function flipCard() {
  // console.log(this.childNodes);
  // console.log("flip the card");
  if (lockBoard) return; // if locked, don't do anything
  clickedCardCount++;
  if (clickedCardCount === 1) {
    this.childNodes[3].classList.toggle("hidden");
    this.childNodes[1].classList.toggle("hidden");
    firstCard = this;
  }
  if (clickedCardCount > 1) {
    if (firstCard !== this) {
      this.childNodes[3].classList.toggle("hidden");
      this.childNodes[1].classList.toggle("hidden");
      secondCard = this;
      clickedCardCount = 0;
      checkForMatch();
    }
  }
}
// check for card match
// display message to user if game is won
function checkForMatch() {
  // console.log(firstCard, secondCard);
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  if (isMatch) {
    // console.log("cards match");
    setTimeout(removeCardsFromGame, 1000); //display for 1 sec before removing
    matchedPairs++;
    if (matchedPairs === 10) {
      clearInterval(interval); //stop the timer
      alert(`YOU WIN!!! It took ${minute}mins and ${second}secs to WIN!!`);
    }
  } else {
    unflipCards();
  }
}
// flip cards facedown by toggling hidden class on images
function unflipCards() {
  // console.log("not a match");
  lockBoard = true; // cannot click more cards
  setTimeout(() => {
    firstCard.childNodes[3].classList.toggle("hidden");
    firstCard.childNodes[1].classList.toggle("hidden");
    secondCard.childNodes[3].classList.toggle("hidden");
    secondCard.childNodes[1].classList.toggle("hidden");
    lockBoard = false; // allow clicking cards again
  }, 1000);
}
// remove cards from game by adding hidden class to images
function removeCardsFromGame() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.childNodes[3].classList.add("hidden");
  firstCard.childNodes[1].classList.add("hidden");
  secondCard.childNodes[3].classList.add("hidden");
  secondCard.childNodes[1].classList.add("hidden");
}
// restore the game board for a new game
// runs on click of Start or Reset buttons
function reset() {
  for (let card of cards) {
    card.style.display = "block"; // display all cards
    card.childNodes[1].classList.add("hidden"); // apply hidden class to fronts
    card.childNodes[3].classList.remove("hidden"); // remove hidden class from backs
    card.removeEventListener("click", flipCard);
  }
  resetBoard(); // resets the card variables
  newDeal(); // shuffle and add to screen
  resetTimer(); // stops and starts the timer at zero
}
// reset all variables
function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  clickedCardCount = 0;
  matchedPairs = 0;
  startPressed = false;
}
// shuffle the cards
function shuffle() {
  for (i = 0; i < cards.length; i++) {
    let randomPos = Math.floor(Math.random() * 20);
    let randomCard = cards[randomPos];
    cards[randomPos] = cards[i];
    cards[i] = randomCard;
    // console.log(randomCard, cards[i], cards);
  }
  // console.log(cards);
}
// shuffle cards and append to gameBoard
function newDeal() {
  gameBoard.innerHTML = "";
  shuffle();
  cards.forEach((card) => {
    gameBoard.appendChild(card);
  });
}
// reset the timer
function resetTimer() {
  clearInterval(interval); // stop the timer
  second = 0; // reset to zero
  minute = 0;
  timer.innerHTML = `${minute}mins ${second}secs`; //display on screen
}