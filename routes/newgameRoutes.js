const express = require("express");
const newgameRoutes = express.Router();
const fs = require("fs");

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

newgameRoutes.get("/", function (req, res) {
    let randomWord = words[getRandomInt(0, words.length - 1)];
    console.log(randomWord);
    let game = {};
    game.word = randomWord;
    game.displayArray = [];
    game.wrongGuesses = [];
    game.correctGuesses = [];
    game.turns = 8;
    for (let i = 0; i < game.word.length; i++) {
        game.displayArray.push("_");
    }
    console.log("turns = ", game.turns);
    req.session.game = game;
    return res.render("index", game);
});

module.exports = newgameRoutes;