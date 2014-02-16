var Deck = require('../deck');

exports.createDeck = function(test) {
    var deck = new Deck();
    test.equal(deck.toString(), '2C,3C,4C,5C,6C,7C,8C,9C,10C,JC,QC,KC,AC,2D,3D,4D,5D,6D,7D,8D,9D,10D,JD,QD,KD,AD,2H,3H,4H,5H,6H,7H,8H,9H,10H,JH,QH,KH,AH,2S,3S,4S,5S,6S,7S,8S,9S,10S,JS,QS,KS,AS')
    test.done();
}

exports.shuffleDeck = function(test) {
    var deck = new Deck();
    deck.shuffle();
    test.equal(deck.cards.length, 52);
    test.notEqual(deck.toString(), '2C,3C,4C,5C,6C,7C,8C,9C,10C,JC,QC,KC,AC,2D,3D,4D,5D,6D,7D,8D,9D,10D,JD,QD,KD,AD,2H,3H,4H,5H,6H,7H,8H,9H,10H,JH,QH,KH,AH,2S,3S,4S,5S,6S,7S,8S,9S,10S,JS,QS,KS,AS')

    deck = new Deck(5);
    deck.shuffle(5);
    test.equal(deck.cards.length, 52);
    test.notEqual(deck.toString(), '2C,3C,4C,5C,6C,7C,8C,9C,10C,JC,QC,KC,AC,2D,3D,4D,5D,6D,7D,8D,9D,10D,JD,QD,KD,AD,2H,3H,4H,5H,6H,7H,8H,9H,10H,JH,QH,KH,AH,2S,3S,4S,5S,6S,7S,8S,9S,10S,JS,QS,KS,AS')

    test.done();
}

exports.drawFromDeck = function(test) {
    // Test drawing a single card from the deck
    var deck = new Deck();
    deck.shuffle();
    var card = deck.drawCard();
    test.ok(card);
    test.equals(deck.cards.length, 51);

    // Test drawing multiple cards at once
    var cards = deck.drawCards(7);
    test.ok(cards);
    test.equals(cards.length, 7);
    test.equals(deck.cards.length, 44);

    // Test drawing more cards than are in the deck
    cards = deck.drawCards(50);
    test.ok(cards);
    test.equals(cards.length, 44);
    test.equals(deck.cards.length, 0);

    // Test drawing from an empty deck
    card = deck.drawCard();
    test.equals(card, null);
    test.equals(deck.cards.length, 0);

    cards = deck.drawCards(5);
    test.equals(cards.length, 0);
    test.equals(deck.cards.length, 0);

    test.done();
}
