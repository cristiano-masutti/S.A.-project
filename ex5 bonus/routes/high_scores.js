/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * /high_scores router
 *
 */



const express = require('express');
const { func, modelRun } = require('fast-check');
const router = express.Router();
module.exports = router;

high_scores = require('../model/high_scores');
let model = require("../model/typing-challenges");

router.get('/game_over', function(req, res) {
    let scores = {
        player : req.query.player,
        score : req.query.score,
        time: req.query.time,
        game : req.query.game,
        text: req.query.challenge
    };
    for (let i = 0; i < model.data.length; i++) {
        if (model.data[i].text == scores.text) {
            model.data[i].counter+=1;
        }
    }
    res.render("game_over", {title: "game over", player: scores.player, score: scores.score, time: scores.time, game: scores.game});
});

router.post('/', function(req, res) {
    let player = req.body.player;
    let score = req.body.score;
    let time = req.body.time;
    let game = req.body.game;
    high_scores.add({player: player, score: parseInt(score), time: time, game: game});
    res.redirect('/games/typing');
});