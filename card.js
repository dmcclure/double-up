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

module.exports = Card;