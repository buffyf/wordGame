const express = require("express");
const wordRoutes = express.Router();
const fs = require("fs");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");
const session = require("express-session");


///////////////////////
///////////////////////
///////////////////////

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
let randomWord = words[getRandomInt(0, words.length - 1)];
console.log(randomWord);
wordRoutes.get("/newgame", function (req, res) {
    let game = {};
    game.word = randomWord;
    game.displayArray = [];
    game.wrongGuesses = [];
    game.correctGuesses = [];
    game.turns = 8;
    for (let i = 0; i < game.word.length; i++) {
        game.displayArray.push("__");
    }
    console.log("turns = ", game.turns);
    req.session.game = game;
    return res.render("index", game); //don't pass the session
});
//this stores the guess and compares it to the random word
wordRoutes.post("/guess", (req, res) => {
    let game = req.session.game; //game is assigned FROM session
    let guessLetter = req.body.letterGuess // this is where the letter is 
    if (alreadyGuessed(game, guessLetter)) {
        saveGame(req, game, "Already guessed");
    }
    for (i = 0; i < game.word.length; i++) {
        if (game.word.charAt(i) === guessLetter) {
            game.displayArray[i] = guessLetter;
            console.log("this is the array: ", game.displayArray);
        }
    }

    let locationOfLetter = randomWord.indexOf(guessLetter) //location of letter
    if (randomWord.includes(guessLetter) == true) {
        game.displayArray.splice(locationOfLetter, 1, guessLetter);
    }
    if (game.displayArray.join('') == randomWord) {
        res.send("You've Won!")
    }
    if (game.turns < 2) {
        res.send("You Loose!");
    }
    if (letterNotFound(game, guessLetter)) {
        game.wrongGuesses.push(guessLetter);
        game.turns -= 1 //decrement turns
        saveGame(req, game, "WRONG"); //setting session game = to local game/game is put into session
        // return res.redirect("/");
    }
    return res.render("index", game); //this fixed my problem: I changed from redirect, to render and passed through the session data to return to the page
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