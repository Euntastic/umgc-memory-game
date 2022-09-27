
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


const POKEMON = pickPokemonNumbers(); // Returns 10 1st Gen Pokemon Numbers

// Testing -----------

// Containers --------
const gameContainer = document.querySelector(".game-container");
const siteContainer = document.querySelector(".container");

// Buttons -----------
const scoreButton = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");
const switchModeButton = document.querySelector("#switch-mode");
const exitButton = document.querySelector(".close-rules");

// Saved Data --------
const savedGame = JSON.parse(localStorage.getItem('save-data')) || [];
let currentScore = 0, lowestScore = 0;
let colorsArray, colorsMatched, pokemonArray, pokemonMatched;


document.addEventListener('DOMContentLoaded', () => {
  createGameBoard();
  populateCards();
})


// Click Events -----------------------
scoreButton.addEventListener('click', (event) => {
  event.preventDefault();
  siteContainer.classList.add('active');
});

newGameButton.addEventListener('click', (event) => {
  event.preventDefault();
  console.log(savedGame);
  if (savedGame) {
    currentScore = savedGame['score']['currentscore'];
    lowestScore = savedGame['score']['lowestscore'];
    colorsArray = saveGame['gamestate']['colors'];
    colorsMatched = savedGame['gamestate']['colorsmatched'];
    pokemonArray = saveGame['gamestate']['pokemon'];
    pokemonMatched = saveGame['gamestate']['pokemonmatched'];
  } else {
    colorsArray = generateCardArray(COLORS);
    pokemonArray = generateCardArray(POKEMON);
  }


  populateCards();
  updateScore(currentScore, lowestScore);
});

switchModeButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (switchModeButton.innerText === 'Pokemon') {
    switchModeButton.innerText = 'Colors';
    matchingArray = colorsArray;
  } else {
    switchModeButton.innerText = 'Pokemon';
    matchingArray = pokemonArray;
  }
});

exitButton.addEventListener('click', (event) => {
  event.preventDefault();
  siteContainer.classList.remove('active');
});

// Functions --------------------------

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
function saveGame(currentScore, lowestScore) {
  savedGame = {
    score: {
      currentscore: currentScore,
      lowestscore: lowestScore
    },
    gamestate: {
      colors: colorArray,
      colorsmatched: colorState,
      pokemon: pokemonArray,
      pokemonmatched: pokemonState
    }
  };
}

// Create the Game Board. By default, a 4x5 box of divs with the class
// of card.
function createGameBoard(numberOfCards = 20) {
  const cardRows = numberOfCards / 5;
  const cardCols = numberOfCards / 4;

  while (gameContainer.firstChild) gameContainer.removeChild(gameContainer.firstChild);

  for (let i = 0; i < cardRows; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row');

    for (let i = 0; i < cardCols; i++) {
      const newCard = document.createElement('div');
      newCard.classList.add('card');

      newRow.appendChild(newCard);
    }
    gameContainer.append(newRow);
  }
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
      cardElement.id = data.name;
    });
  cardElement.style.backgroundImage = `url(${newPokemonUrl})`;
  cardElement.style.backgroundPosition = 'center';
  cardElement.style.backgroundRepeat = 'no-repeat';
  return cardElement;
}

// Populate the cards with content.

function populateCards(cardContentArray) {
  const allCardsArray = document.querySelectorAll('div .card');
  let cardContentIndex = 0;

  for (let card of allCardsArray) {
    let cardContent;
    if (cardContentArray) cardContent = cardContentArray[cardContentIndex];
    else cardContent = '🐢';
    
    if (COLORS.includes(cardContent)) {
      card.classList.add(cardContent);
      card.style.backgroundColor = cardContent;
    } else if (POKEMON.includes(cardContent)) {
      card = generatePokemon(card, cardContent);
    } else {
      card.innerText = cardContent;
      card.style.fontSize = '3rem';
    }

    cardContentIndex++;
  }
}

// Let the player try to match cards.

// Update the save file every click.
// Every time the score is ticked.
// Save file > Save Score and Gameboard State.