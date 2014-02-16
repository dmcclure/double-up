/**
 * A class to represent a playing card.
 * @constructor
 * @param {string} rank A string representing the rank. e.g., '2', '3', '10', 'K', 'A'
 * @param {string} suit A string representing the suit. It will be either 'C', 'D', 'H' or 'S'
 */
function Card(rank, suit) {
    this.rank = rank;
    this.suit = suit;

    // Work out the card's value (we're ignoring suits)
    switch (rank) {
        case 'J': this.value = 11; break;
        case 'Q': this.value = 12; break;
        case 'K': this.value = 13; break;
        case 'A': this.value = 14; break;
        default: this.value = parseInt(rank); break;
    }
}

/**
 * A function to return whether this card beats another
 * @param {Card} card The card to compare this card to
 * @returns {boolean} True if this card beats the card specified
 */
Card.prototype.beats = function(card) {
    return this.value > card.value;
};

Card.prototype.toString = function() {
    return this.rank + this.suit;
}


/**
 * A class to represent a deck of cards. The deck is created with all the cards in order.
 * @constructor
 */
function Deck() {
    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = ['C', 'D', 'H', 'S'];

    // Create a sorted deck
    this.cards = [];
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < ranks.length; j++) {
            this.cards[i * ranks.length + j] = new Card(ranks[j], suits[i]);
        }
    }
}

/**
 * Shuffle the deck.
 * @param {number} iterations The number of times to shuffle the deck. Defaults to 1
 */
Deck.prototype.shuffle = function(iterations) {
    var n = iterations || 1;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < this.cards.length; j++) {
            var k = Math.floor(Math.random() * this.cards.length);
            var temp = this.cards[j];
            this.cards[j] = this.cards[k];
            this.cards[k] = temp;
        }
    }
};

/**
 * Returns the card that is on top of the deck and removes the card from the deck.
 * @returns {Card} The card on top of the deck, or null if the deck is empty
 */
Deck.prototype.drawCard = function() {
    if (this.cards.length > 0) {
        return this.cards.shift();
    }
    else {
        return null;
    }
};

/**
 * Remove and return the specified number of cards from the top of the deck. If there are not enough cards in the deck
 * then however many cards are left in the deck will be returned.
 * @returns {array} An array of cards removed from the top of the deck
 */
Deck.prototype.drawCards = function(n) {
    var drawnCards = [];

    for (var i = 0; i < n; i++) {
        if (this.cards.length > 0) {
            drawnCards.push(this.cards.shift());
        }
        else {
            return drawnCards;
        }
    }

    return drawnCards;
};

Deck.prototype.toString = function() {
    return this.cards.toString();
}
