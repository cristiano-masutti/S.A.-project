/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * /high_scores router
 *
 */



const express = require('express');
const { func } = require('fast-check');
const router = express.Router();
module.exports = router;

high_scores = require('../model/high_scores')

router.get('/game_over', function(req, res) {
    let scores = {
        player : req.query.player,
        score : req.query.score
    }
    res.render("game_over", {title: "game over", player: scores.player, score: scores.score});
});

router.post('/', function(req, res) {
    let player = req.body.player;
    let score = req.body.score;
    high_scores.add({player: player, score: parseInt(score)});
    res.redirect('/index.html');
});