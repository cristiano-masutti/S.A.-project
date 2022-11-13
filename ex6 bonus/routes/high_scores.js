/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * /high_scores router
 *
 */



const { query } = require('express');
const express = require('express');
const { func } = require('fast-check');
const { db } = require('mongodb');
let { model } = require('../model/');
const high_scores = require('../model/high_scores');
// const high_scores = require('../model/high_scores');
const router = express.Router();
module.exports = router;

// high_scores = require('../model/high_scores')

router.get('/game_over', function(req, res) {
    console.log("hi");
    let newPlayer = req.query.player;
    let newScore = parseInt(req.query.score)
    let newChallenge = req.query.challenge;

    target = {text : req.query.challenge};

    if (newChallenge != undefined) {
        console.log(newChallenge);
        model.typing_challenges.findOne(target).then(typing_challenges => {
            console.log(typing_challenges);
            newChallenge = {
                _id : typing_challenges._id,
                text : typing_challenges.text,
                author : typing_challenges.author,
                counter : typing_challenges.counter+1
            };
            model.typing_challenges.replaceOne(typing_challenges, newChallenge, upsert=true).then(() => {
                model.high_scores.find({}).toArray().then(high_scores => {
                    res.render("game_over", {title: "game over", player: newPlayer, score: newScore, high_scores: high_scores})
                })
            });
        }); 
    } else {
        model.high_scores.find({}).toArray().then(high_scores => {
            res.render("game_over", {title: "game over", player: newPlayer, score: newScore, high_scores: high_scores})
        })
    }
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


// bonus 3.1
router.get('/', function(req, res) {
    let sort = req.query.sort;
    let best = parseInt(req.query.top);

    if (sort != undefined && sort != "") {
        if (sort == "player") {
            query = {player : -1};
        } else {
            query = {score : -1};
        }
    } else {
        query = {score : -1};
    }

    model.high_scores.find({}).sort(query).toArray().then(high_scores => {
        if (best != undefined && !isNaN(best) && best <= high_scores.length) {
            size = best;
        } else {
            size = high_scores.length;
        }
        newHighScores = [];
        for (let i = 0; i < size; i++) {
            newHighScores.push(high_scores[i]);
        }
        res.json(newHighScores);
    });
});

router.delete('/', function(req, res) {
    model.high_scores.deleteMany({}).then(result => {
        res.status(204).json(result);
    })
});

