const express = require("express");
const wordRoutes = express.Router();
const session = require("express-session");
const newgameRoutes = express.Router();



///////////////////////
///////////////////////
///////////////////////





//this stores the guess and compares it to the random word
wordRoutes.post("/guess", (req, res) => {
    let game = req.session.game; //game is assigned FROM session
    let guessLetter = req.body.letterGuess.toUpperCase()// this is where the letter is entered in the form
    let randomWord = req.session.game.word;


    if (alreadyGuessed(game, guessLetter)) {
        saveGame(req, game, "Already guessed");
    }

    else if (letterNotFound(game, guessLetter)) {
        game.wrongGuesses.push(guessLetter);
        game.turns -= 1 //decrement turns
        saveGame(req, game, "WRONG"); //setting session game = to local game/game is put into session

    } else {

        for (i = 0; i < game.word.length; i++) {
            if (game.word.charAt(i) === guessLetter) {
                game.displayArray[i] = guessLetter;
                console.log("this is the array: ", game.displayArray);
            }
        }

        let locationOfLetter = randomWord.indexOf(guessLetter) //location of letter
        if (randomWord.includes(guessLetter) == true) {
            game.displayArray.splice(locationOfLetter, 1, guessLetter);
            saveGame(req, game, "Correct!");


        }
    };
    if (game.displayArray.join('') === randomWord) {
        saveGame(req, game, "You Win");

    }
    if (game.turns < 1) {
        saveGame(req, game, `You Loose!, the word was ${randomWord}`);
    }

    return res.render("index", game);
});

//redirect takes user to another page a RESTARTS the request
//render simply takes them to the page, and loadst he data, in this case the session
function saveGame(req, game, message) {
    game.message = message;
    req.session.game = game;
}
function letterNotFound(game, guessLetter) {
    return game.word.indexOf(guessLetter) < 0;
}
function alreadyGuessed(game, guessLetter) {
    return (game.wrongGuesses.indexOf(guessLetter) > -1 ||
        game.correctGuesses.indexOf(guessLetter) < -1)
}

module.exports = wordRoutes;
