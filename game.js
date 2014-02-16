var Deck = require('./deck');
var Card = require('./card');
var uuid = require('node-uuid');

/**
 * A class to represent a game of Double Up.
 * @constructor
  * @param existingGame An object holding the parameters of an existing game. If not specified a new game will be created
*/
function Game(existingGame) {
    this.deck = new Deck();                    // The deck used by the game
    this.deck.shuffle(5);                      // Give the deck a good shuffle

    if (existingGame === undefined) {
        // Setup a new game
        this.id = uuid.v1();                       // Every game has a globally unique ID
        this.balance = 1;                          // Initialize the player's balance to 1 credit
        this.dealerCard = this.deck.drawCard();    // The card to beat!
        this.playerCard = null;                      // The player hasn't selected a card yet
        this.roundInProgress = true;               // Start a new round automatically
    }
    else {
        // Initialize this game with an existing game's values
        this.id = existingGame.id;
        this.balance = existingGame.balance;
        this.roundInProgress = existingGame.roundInProgress;

        // The existingGame.dealerCard variable is a string like '2D', '10S', 'AH' etc, so we need to extract the rank and suit
        this.dealerCard = new Card(existingGame.dealerCard.slice(0, -1), existingGame.dealerCard.slice(-1));

        // Do the same for the player's card (if a card has been selected)
        if (existingGame.playerCard) {
            this.playerCard = new Card(existingGame.playerCard.slice(0, -1), existingGame.playerCard.slice(-1));
        }
    }
}

Game.getState = function(game) {
    return { id: game.id, dealerCard: game.dealerCard.toString(), playerCard: (game.playerCard) ? game.playerCard.toString() : '', balance: game.balance, roundInProgress: game.roundInProgress };
}

/**
 * Perform a play of the game by selecting one of the four face down cards, hoping to beat the dealer's card.
 * @param {number} cardSelected Zero-based index of the selected card. Must be between 0 and 3.
 * @returns {object} The new state of the game with the dealer card removed and the player's selected card added
 */
Game.prototype.selectCard = function(cardSelected) {
    if (cardSelected < 0 || cardSelected > 3) {
        throw new Error('cardSelected must be between 0 and 3');
    }

    if (!this.roundInProgress) {
        throw new Error('A game round is not in progress');
    }

    if (this.balance <= 0) {
        throw new Error('The game is over. You need to create a new one');
    }

    console.log('Dealer\'s card: ' + this.dealerCard.toString());

    // Shuffle the deck once more to ensure there is no cheating
    this.deck.shuffle(5);

    // Draw the four cards the player picked from
    var playerCards = this.deck.drawCards(4);
    console.log('Player cards: ' + playerCards.toString());

    // Obtain the card the player picked
    this.playerCard = playerCards[cardSelected];
    console.log('Player selected : ' + this.playerCard.toString());

    // Now compare the player's card to the dealer's card
    if (this.playerCard.beats(this.dealerCard)) {  // If the player's card is higher than the dealer's card, they won (lucky...)
        this.balance *= 2;
    }
    else if (this.dealerCard.beats(this.playerCard)) {  // If the dealer's card is higher than the player's card, the player lost
        this.balance = 0;  // Game over!
    }
    else {
        // The player's card matches the dealer's card, so it's a push
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
    this.playerCard = null;
    this.roundInProgress = true;

    // Return the game's new state
    return Game.getState(this);
}

module.exports = Game;