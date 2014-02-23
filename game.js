var Deck = require('./deck');
var Card = require('./card');
var uuid = require('node-uuid');

/**
 * A class to represent a game of Double Up.
 * @constructor
  * @param existingGame An object holding the parameters of an existing game. If not specified a new game will be created
*/
function Game(existingGame) {
    this.deck = new Deck();          // The deck used by the game
    this.deck.shuffle(5);            // Give the deck a good shuffle
    this.playerCards = [];           // This array will hold the three cards the player was dealt after they have selected a card
    this.playerCardSelected = null;  // This will hold the index of the card in the playerCards array the player selected. It will be set after the player selects a card
    this.roundResult = null;         // 1 if player won; -1 if player lost; 0 if player and dealer drew (a "push")

    if (existingGame === undefined) {
        // Setup a new game
        this.id = uuid.v1();                       // Every game has a globally unique ID
        this.balance = 1;                          // Initialize the player's balance to 1 credit
        this.dealerCard = this.deck.drawCard();    // The card to beat!
        this.roundInProgress = true;               // Start a new round automatically
    }
    else {
        // Initialize this game with an existing game's values
        this.id = existingGame.id;
        this.balance = existingGame.balance;
        this.roundInProgress = existingGame.roundInProgress;
        this.playerCardSelected = existingGame.playerCardSelected;
        this.roundResult = existingGame.roundResult;

        // The existingGame.dealerCard variable is a string like '2D', '10S', 'AH' etc, so we need to extract the rank and suit
        this.dealerCard = new Card(existingGame.dealerCard.slice(0, -1), existingGame.dealerCard.slice(-1));

        // Do the same for the player's cards
        if (existingGame.playerCards) {
            for (var i = 0; i < existingGame.playerCards.length; i++) {
                this.playerCards[i] = new Card(existingGame.playerCards[i].slice(0, -1), existingGame.playerCards[i].slice(-1));
            }
        }
    }
}

Game.getState = function(game) {
    var state = {
        id: game.id,
        dealerCard: game.dealerCard.toString(),
        balance: game.balance,
        roundInProgress: game.roundInProgress,
        roundResult: game.roundResult
    };

    if (game.playerCardSelected) {
        state.playerCardSelected = game.playerCardSelected;
        state.playerCards = [];
        for (var i = 0; i < game.playerCards.length; i++) {
            state.playerCards[i] = game.playerCards[i].toString();
        }
    };

    return state;
}

/**
 * Perform a play of the game by selecting one of the three face down cards, hoping to beat the dealer's card.
 * @param {number} cardSelected Zero-based index of the selected card. Must be between 0 and 2.
 * @returns {object} The new state of the game with the dealer card removed and the player's selected card added
 */
Game.prototype.selectCard = function(cardSelected) {
    if (cardSelected < 0 || cardSelected > 2) {
        throw new Error('cardSelected must be between 0 and 2');
    }

    if (!this.roundInProgress) {
        throw new Error('A game round is not in progress');
    }

    if (this.balance <= 0) {
        throw new Error('The game is over. You need to create a new one');
    }

    // Shuffle the deck once more to ensure there is no cheating
    this.deck.shuffle(5);

    // Record the index of the card the player picked
    this.playerCardSelected = cardSelected;

    // Draw the three cards the player picked from
    this.playerCards = this.deck.drawCards(3);

    // Obtain the card the player picked
    var cardPicked = this.playerCards[cardSelected];

    // Now compare the player's card to the dealer's card
    if (cardPicked.beats(this.dealerCard)) {  // If the player's card is higher than the dealer's card, they won (lucky...)
        this.balance *= 2;
        this.roundResult = 1;
    }
    else if (this.dealerCard.beats(cardPicked)) {  // If the dealer's card is higher than the player's card, the player lost
        this.balance = 0;  // Game over!
        this.roundResult = -1;
    }
    else {
        // The player's card matches the dealer's card, so it's a push
        this.roundResult = 0;
    }

    this.roundInProgress = false;

    // Return the game's new state
    return Game.getState(this);
};

/**
 * Start a new game round
 * @returns {object} The new state of the game after starting the new round
 */
Game.prototype.newRound = function() {
    if (this.roundInProgress) {
        throw new Error('A game round is already in progress');
    }

    if (this.balance <= 0) {
        throw new Error('The game is over. You need to create a new one');
    }

    // Shuffle the deck and select a card for the dealer
    this.deck.shuffle(5);
    this.dealerCard = this.deck.drawCard();
    this.playerCards = [];
    this.playerCardSelected = null;
    this.roundInProgress = true;

    // Return the game's new state
    return Game.getState(this);
}

module.exports = Game;