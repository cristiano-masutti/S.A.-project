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
let { model } = require('../model/');
// const high_scores = require('../model/high_scores');
const router = express.Router();
module.exports = router;

// high_scores = require('../model/high_scores')

router.get('/game_over', function(req, res) {
    let player = req.query.player;
    let score = parseInt(req.query.score)

    model.high_scores.find({}).toArray().then(high_scores => {
        res.format({
            'text/html' : function() {
                res.render('game_over', {title: "game-over", player : player, score: score, high_scores : high_scores});
            }, 'application/json' : function() {
                res.redirect('/', {title: "game-over", player : player, score: score , high_scores:high_scores});
            }
        })
    });
});

router.post('/', function(req, res) {
    let scores = {
        player : req.body.player,
        score : parseInt(req.body.score)
    }

    model.high_scores.insertOne(scores).then(()=> {
        res.format({
            'text/html' : function() {
                res.redirect('/index.html');
            }, 'application/json' : function() {
                res.status(201).json(scores);
            }
        })
    });
});

router.get('/', function(req, res) {
    model.high_scores.find({}).toArray().then(high_scores => {
        res.format({
            'application/json' : function() {
                res.json(high_scores);
            }
        })
    });
});

