double-up
=========

A game of double or nothing. This Node.js application exposes a REST API to create and play a game of Double Up.

The dealer draws a card and the player must select one of four face down cards hoping to beat the dealer.

If the player's card beats the dealer's card, their balance doubles.

If the dealer's card beats the player's card, the game is over and the player's balance is set to zero.

If the dealer's card and player's card match, it is a push.


REST API
--------

### POST /v1/game
Create a new game. The game's initial state will be returned like the following:

```
{
  "id": "d52dce00-977a-11e3-82bf-ed14dd4e4a1b",
  "dealerCard": "9H",
  "balance": 1,
  "roundInProgress": true
}
```

*Attributes:*
* **id**: Unique ID of the new game
* **dealerCard**: The card the dealer drew
* **balance**: The player's current balance
* **roundInProgress**: True if a round is currently in progress, false if the round is over

### GET /v1/game/{id}
Retrieve the state of an existing game. For example:

```
{
  "id": "d52dce00-977a-11e3-82bf-ed14dd4e4a1b",
  "dealerCard": "9H",
  "balance": 1,
  "roundInProgress": true
}
```


### PUT /v1/game/{id}
Play a game round that is in progress. The client should send a JSON object specifying which of the four face down cards the player chose. The card selected must be specified as either 0, 1, 2 or 3. For example:

```
{"cardSelected": 2}
```

The request should be sent with a Content-Type of "application/json". The game's new state will be returned with two extra attributes. For example:

```
{
  "id": "d52dce00-977a-11e3-82bf-ed14dd4e4a1b",
  "dealerCard": "9H",
  "balance": 2,
  "roundInProgress": false,
  "playerCardSelected": 2,
  "playerCards": [
    "3D",
    "7H",
    "JS",
    "5S"
  ]}
```

*Additional attributes:*
* **playerCards**: An array containing the four cards the player was dealt
* **playerCardSelected**: Index of the card in the playerCards array the player selected


### POST /v1/game/{id}/round
Start a new round in an existing game. The game's new state will be returned. For example:

```
{
  "id": "d52dce00-977a-11e3-82bf-ed14dd4e4a1b",
  "dealerCard": "QS",
  "balance": 2,
  "roundInProgress": true
}
```

### Notes
* A game is considered over when the player's balance drops to zero.
* If an invalid game ID is specified, the server will respond with a 404 error.
* If an invalid command is issued (such as attempting to select a card with PUT when a round is not in progess) the server will respond with a 500 error.