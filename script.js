
// ------------------------------------
// Constants & Variables --------------

// List of available colors for cards.
const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "brown",
  "black",
  "gray",
];

const pokemonUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";


let pokemon = pickPokemonNumbers(); // Returns 10 1st Gen Pokemon Numbers

let matchingArray = [];

let matchedCount = 0;

// Testing -----------

// Containers --------
const gameContainer = document.querySelector(".game-container");
const siteContainer = document.querySelector(".container");

// Buttons -----------
const scoreButton = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");
const switchModeButton = document.querySelector("#switch-mode");
const exitButton = document.querySelector(".close-end");

// Saved Data --------
const savedGame = JSON.parse(localStorage.getItem('save-data')) || [];
let currentScore = 0, lowestScore = NaN;
let colorsArray, pokemonArray;


// Document Load Event ----------------
document.addEventListener('DOMContentLoaded', () => {
  console.log(savedGame[0]);
  if (savedGame.length) {
    // currentScore = savedGame[0]['score']['currentscore'];
    lowestScore = 99;
    // lowestScore = savedGame[0]['score']['lowestscore'];
  }
  
  matchingArray = generateCardArray(COLORS);
  createGameBoard(matchingArray);
  updateScore(currentScore, lowestScore);
});


// Click Events -----------------------
// scoreButton.addEventListener('click', (event) => {
//   event.preventDefault();
//   siteContainer.classList.add('active');
// });

newGameButton.addEventListener('click', (event) => {
  event.preventDefault();

  currentScore = 0;
  lowestScore = savedGame[0]['score']['lowestscore'];

  colorsArray = generateCardArray(COLORS);
  // colorsMatched = [];

  pokemon = pickPokemonNumbers();
  pokemonArray = generateCardArray(pokemon);
  // pokemonMatched = [];

  matchedCount = 0;

  if (switchModeButton.innerText === 'Colors') matchingArray = pokemonArray;
  else if (switchModeButton.innerText === 'Pokemon') matchingArray = colorsArray;

  createGameBoard(matchingArray);
  updateScore(currentScore, lowestScore);
});

switchModeButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (switchModeButton.innerText === 'Pokemon') {
    switchModeButton.innerText = 'Pokemon';
    matchingArray = pokemonArray;
  } else {
    switchModeButton.innerText = 'Colors';
    matchingArray = colorsArray;
  }

  createGameBoard(matchingArray);
});

exitButton.addEventListener('click', (event) => {
  event.preventDefault();
  siteContainer.classList.toggle('active');
});

gameContainer.addEventListener('click', handleCardClick);

// Functions --------------------------

let firstCard = null, secondCard = null;
let timerId;

// Click Card Function ----------------
function handleCardClick(event) {
  let currentCard = event.target.parentElement;

  console.log(currentCard);
  if (!currentCard.classList.contains('card')) return;
  if (currentCard.classList.contains('is-flipped')) return;
  // if (currentCard.innerText == '🐢') return;
  if (timerId) return;

  currentScore += 1;
  updateScore(currentScore, lowestScore);

  if (!firstCard) {
    firstCard = currentCard;
    firstCard.classList.toggle('is-flipped');

  } else if (!secondCard) {
    secondCard = currentCard;
    secondCard.classList.toggle('is-flipped');

    let firstCardBack = firstCard.querySelector('div .card__face--back');
    let secondCardBack = secondCard.querySelector('div .card__face--back');

    if (firstCardBack.classList[2] == secondCardBack.classList[2]) { 
      console.log('Is Matched');
      matchedCount += 2;
      firstCard = null;
      secondCard = null;
      
      if (matchedCount == 20) {
        siteContainer.classList.toggle('active');
        saveGame();
      }
    } else {
      timerId = setTimeout(function() {
      firstCard.classList.toggle('is-flipped');
      secondCard.classList.toggle('is-flipped');
      firstCard = null;
      secondCard = null;
      timerId = undefined;
      }, 1000);
    }
  } else {
    firstCard = null;
    secondCard = null;
  }
}

// Update Score
function updateScore(currentScore, lowestScore) {
  scoreButton.innerText = '';
  const lowestScoreDiv = document.createElement('div');
  const currentScoreDiv = document.createElement('div');
  lowestScoreDiv.innerText = `Lowest Score: ${lowestScore}`;
  currentScoreDiv.innerText = `Current Score: ${currentScore}`;
  scoreButton.appendChild(lowestScoreDiv);
  scoreButton.appendChild(currentScoreDiv);
}

// Save game state.
function saveGame() {
  if (currentScore < lowestScore) lowestScore = currentScore;
  savedGameData = {
    score: {
      currentscore: currentScore,
      lowestscore: lowestScore
    },
    // gamestate: {
    //   colors: colorsArray,
    //   colorsmatched: colorsMatched,
    //   pokemon: pokemonArray,
    //   pokemonmatched: pokemonMatched
    // }
  };
  savedGame.splice(0, 1, savedGameData);
  localStorage.setItem('save-data', JSON.stringify(savedGame));
}

// Create the Game Board. By default, a 4x5 box of divs with the class
// of card.
function createGameBoard(cardContentArray) {
  const numberOfCards = cardContentArray.length || 20;
  const cardRows = numberOfCards / 5;
  const cardCols = numberOfCards / 4;

  while (gameContainer.firstChild) gameContainer.removeChild(gameContainer.firstChild);

  for (let i = 0; i < cardRows; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    for (let i = 0; i < cardCols; i++) {
      const newScene = document.createElement('div');
      newScene.classList.add('scene');
      const newCard = document.createElement('div');
      newCard.classList.add('card');

      const newCardFaceFront = document.createElement('div');
      newCardFaceFront.classList.add('card__face', 'card__face--front');
      const newCardFaceBack = document.createElement('div');
      newCardFaceBack.classList.add('card__face', 'card__face--back');

      newCard.appendChild(newCardFaceFront);
      newCard.appendChild(newCardFaceBack);
      newScene.appendChild(newCard);
      newRow.appendChild(newScene);
    }
    gameContainer.append(newRow);
  }
  populateCards(cardContentArray);
}

// Shuffle Arrays
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate Arrays with card content.
function generateCardArray(dataArray) {
  const matchableArray = dataArray.concat(dataArray);
  return shuffle(matchableArray);
}

// Pokemon Specific Functions ---------

function pickPokemonNumbers() {
  const tempNumberArray = Array();
  for (let i = 0; i < 10; i++) {
    const pokemonNumber = Math.floor(Math.random() * 151) + 1;

    if (tempNumberArray.includes(pokemonNumber)) i--;
    else tempNumberArray.push(pokemonNumber);
  }
  return tempNumberArray;
}

function generatePokemon(cardElement, cardContent) {
  const newPokemonUrl = `${pokemonUrl}${cardContent}.png`;
  fetch(`https://pokeapi.co/api/v2/pokemon/${cardContent}/`)
    .then((response) => response.json())
    .then((data) => {
      cardElement.classList.add(data.name);
    });
  cardElement.style.backgroundColor = 'white';
  cardElement.style.backgroundImage = `url(${newPokemonUrl})`;
  cardElement.style.backgroundPosition = 'center';
  cardElement.style.backgroundRepeat = 'no-repeat';
  return cardElement;
}

// Populate the cards with content.

function populateCards(cardContentArray) {
  const allCardsBacks = document.querySelectorAll('div .card__face--back');
  const allCardsFronts = document.querySelectorAll('div .card__face--front');

  for (let card of allCardsFronts) {
    card.innerText = '🐢';
    card.style.fontSize = '3rem';
  };

  let cardContentIndex = 0;

  for (let card of allCardsBacks) {
    let cardContent;

    if (cardContentArray.length) cardContent = cardContentArray[cardContentIndex];
    
    if (COLORS.includes(cardContent)) {
      card.classList.add(cardContent);
      card.style.backgroundColor = cardContent;
    } else if (pokemon.includes(cardContent)) {
      card = generatePokemon(card, cardContent);
    }

    cardContentIndex++;
  }
}