const timer = document.getElementById('timer');
let seconds = 0;
let timerInterval;

function runTimer() {
	seconds++;
	const pad = (n) => n < 10 ? `0${n}` : n;
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds - m * 60);
	timer.innerHTML = `${pad(m)}:${pad(s)}`;
}

let cards = Array.from(document.querySelectorAll('.memory-card'));
const gameBoard = document.getElementById('game-board');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let clickedCardCount = 0;
let matchedPairs = 0;
let startClicked = false;

function startButtonClick() {
	if (!startClicked) {
		timerInterval = setInterval(runTimer, 1000);
		cards.forEach((card) => card.addEventListener('click', flipCard));
		startClicked = true;
	}
}

document.getElementById('start-button').addEventListener('click', startButtonClick);

function flipCard() {
	if (lockBoard) return;
	clickedCardCount++;
	if (clickedCardCount === 1) {
		this.childNodes[3].classList.toggle('hidden');
		this.childNodes[1].classList.toggle('hidden');
		firstCard = this;
	}
	if (clickedCardCount > 1) {
		if (firstCard !== this) {
			this.childNodes[3].classList.toggle('hidden');
			this.childNodes[1].classList.toggle('hidden');
			secondCard = this;
			clickedCardCount = 0;
			checkForMatch();
		}
	}
}

function checkForMatch() {
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	if (isMatch) {
		setTimeout(removeCardsFromGame, 1000);
		matchedPairs++;
		if (matchedPairs === 10) {
			clearInterval(timerInterval);
			alert(`Congrats, you win!!!\r\nYour time: ${timer.innerText}`);
		}
	} else {
		unflipCards();
	}
}

function removeCardsFromGame() {
	firstCard.removeEventListener('click', flipCard);
	secondCard.removeEventListener('click', flipCard);
	firstCard.classList.remove('clickable');
	secondCard.classList.remove('clickable');
	firstCard.childNodes[3].classList.add('hidden');
	firstCard.childNodes[1].classList.add('hidden');
	secondCard.childNodes[3].classList.add('hidden');
	secondCard.childNodes[1].classList.add('hidden');
}

function unflipCards() {
	lockBoard = true;
	setTimeout(() => {
		firstCard.childNodes[3].classList.toggle('hidden');
		firstCard.childNodes[1].classList.toggle('hidden');
		secondCard.childNodes[3].classList.toggle('hidden');
		secondCard.childNodes[1].classList.toggle('hidden');
		lockBoard = false;
	}, 1000);
}

function resetBoard() {
	hasFlippedCard = false;
	lockBoard = false;
	firstCard = null;
	secondCard = null;
	clickedCardCount = 0;
	matchedPairs = 0;
	startClicked = false;
}

function shuffle() {
	for (i = 0; i < cards.length; i++) {
		let randomPos = Math.floor(Math.random() * 20);
		let randomCard = cards[randomPos];
		cards[randomPos] = cards[i];
		cards[i] = randomCard;
	}
}

function newDeal() {
	gameBoard.innerHTML = '';
	shuffle();
	cards.forEach((card) => {
		gameBoard.appendChild(card);
	});
}

window.addEventListener('DOMContentLoaded', (event) => {
	newDeal();
});

function resetTimer() {
	clearInterval(timerInterval);
	seconds = 0;
	timer.innerHTML = '00:00';
}

function reset() {
	for (let card of cards) {
		card.style.display = 'block';
		card.classList = 'memory-card clickable';
		card.childNodes[1].classList.add('hidden');
		card.childNodes[3].classList.remove('hidden');
		card.removeEventListener('click', flipCard);
	}
	resetBoard();
	newDeal();
	resetTimer();
}

document.getElementById('reset-button').addEventListener('click', reset);