// Setup ==============================
var express = require('express');
var app = express();
var Game = require('./game');


// Configuration ======================
app.configure(function() {
    app.use(express.logger('dev'));                 // Log every request to the console
    app.use(express.json());                        // Support JSON-encoded bodies
    app.use(express.urlencoded());                  // Support URL-encoded bodies
    app.use(express.cookieParser());                // To parse the session cookie
    app.use(express.session({secret: 'hunter2'}));  // Use the session framework
    app.use(app.router);
    app.use(error);
});


// Error handler ======================

function error(err, req, res, next) {
  // Log the error
  console.error(err.stack);

  // Respond with 500 "Internal Server Error".
    console.log(err);
  res.json(500, { error: err.message });
}


// Routes =============================

// Start a brand new game
app.post('/v1/game', function(req, res) {
    var game = new Game();
    req.session[game.id] = Game.getState(game);  // Store the new game in session storage (we'd normally use a DB but this is an example project)
    res.json(Game.getState(game));
});

// Return the state of an existing game
app.get('/v1/game/:id', function(req, res) {
    var gameState = req.session[req.params.id];
    if (!gameState) {
        res.json(404, { error: 'Game not found' });
    }
    else {
        res.json(gameState);
    }
});

// Play an existing game that is in progress by selecting one of the four player cards
app.put('/v1/game/:id', function(req, res) {
    var gameState = req.session[req.params.id];
    if (!gameState) {
        res.json(404, { error: 'Game not found' });
    }
    else {
        var game = new Game(gameState);
        gameState = game.selectCard(req.param('cardSelected'));
        req.session[game.id] = gameState;  // Store the updated game
        res.json(gameState);
    }
});

// Start a new round in an existing game
app.post('/v1/game/:id/round', function(req, res) {
    var gameState = req.session[req.params.id];
    if (!gameState) {
        res.json(404, { error: 'Game not found' });
    }
    else {
        var game = new Game(gameState);
        gameState = game.newRound();
        req.session[game.id] = gameState;  // Store the updated game
        res.json(gameState);
    }
});


// Start listening ====================
var port = process.argv[2] || 8000;
app.listen(port);
console.log('Server is now listening on port ' + port);
