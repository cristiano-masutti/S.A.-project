/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * /games router
 *
 *
 */

const express = require('express');
const router = express.Router();
module.exports = router;

let model = require("../model/typing-challenges");
const hs = require('../model/high_scores');

challenges = []

router.get('/typing', function(req, res, next) {
    res.render('typing', {title: "typing", high_scores: hs.data});
});

router.get('/snake', function(req, res, next) {
    res.render('snake', {title: "snake", high_scores: hs.data});
});

router.get('/typing/challenges', function(req, res) {
    res.render('typing-challenges', {title: "challenges", challenges: model.data, high_scores: high_scores.data});
});
router.post('/typing/challenges', function(req,res) {
    const createChallenge = {
        text: req.body.text,
        author: req.body.author,
        level: req.body.level, 
        counter: 0
    };
    model.data.push(createChallenge);
    model.nextId();
    model.save();
    res.render('typing-challenges', {title: 'typing challenges', challenges: model.data, high_scores: hs.data}) 
});

router.get('/typing/challenges/:id/edit', function(req, res) {
    let id  = req.params.id;
    res.render('typing-challenges-edit', {title: 'typing challenges', challenges: model.data, high_scores: hs.data, id: id}) 
});

router.put('/typing/challenges/:id', function(req, res) {
    let id = req.params.id;

    model.data[id].text = req.body.text;
    model.data[id].author = req.body.author;
    model.data[id].level = req.body.level;
    model.data[id].counter = 0;
    model.save();

    res.redirect('/games/typing/challenges'); 
});

router.delete('/typing/challenges/:id', function(req, res) {
    let id = req.params.id;

    model.data.splice(id, 1);
    model.save();

    res.redirect('/games/typing/challenges'); 
});

router.get('/typing/challenges.js', function(req, res) {
    if (model.data) {
        challenges = model.data;
    } else {
        challenges = [];
    }
    res.render('typing-challenges-js', {title: 'typing challenges', challenges: challenges, high_scores: hs.data}) 
});
    

router.post('/random', function(req, res) {
    let game = Math.random() > 0.5? 'typing' : 'snake';

    const playerName = {
        name: req.body.player
    };

    res.redirect(`/games/${game}?player=${playerName.name}`)
});

router.get('/typing/challenges/:id/test', function(req, res) {
    let id = req.params.id;
    res.render('typing-challenges-test', {
        title: 'typing challenges test', 
        challenges: model.data, 
        id: id, 
        scores: high_scores.data,
        challenge: model.data[id].text
    });
});

router.get('/typing/challenges-test.js', function(req, res) {

    console.log(req.query.challenge);

    res.render('typing-challenges-js', {
        challenges: [{text: req.query.challenge}], 
        scores: high_scores.data
    });
});