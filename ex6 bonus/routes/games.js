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
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();
module.exports = router;

let { model } = require("../model/");
const high_scores = require('../model/high_scores');
let db = require("../model/").model;
const hs = require('../model/high_scores');

router.get('/typing', function (req, res, next) {
    model.typing_challenges.find({}).toArray().then(() => {
        model.high_scores.find({}).toArray().then(high_scores => {
            res.format({"text/html" : function() {
                res.render('typing', {title: 'typing', high_scores: high_scores, player: req.query.player});
            }});
        });
    });
});

// router.get('/browse.html', function (req, res, next) {
//     res.render('browse', { title: "typing", high_scores: hs.data });
// });

// router.get('/play.html', function (req, res, next) {
//     res.render('play', { title: "typing", high_scores: hs.data });
// });

// router.get('/browse.html', function (req, res, next) {
//     res.render('browse', { title: "typing", high_scores: hs.data });
// });

router.get('/snake', function (req, res, next) {
    model.high_scores.find({}).toArray().then(high_scores => {
        res.format({'text/html': function() {
            res.render("snake", {title: 'snake', high_scores:high_scores});
        }});
    });
});

router.get('/typing/challenges', function (req, res) {
    model.typing_challenges.find({}).toArray().then(typing_challenges => {
        model.high_scores.find({}).toArray().then(high_scores => {
            res.format({
                "text/html": function () {
                    res.render('typing-challenges', { title: 'typing', challenges: typing_challenges, high_scores: high_scores });
                }, 'application/json': function () {
                    res.status(200).json(typing_challenges);
                }
            });
        });
    });
});

router.post('/typing/challenges', function (req, res) {
    let createChallenge = {
        text: req.body.text,
        author: req.body.author,
        level: req.body.level,
        counter: 0
    };

    model.typing_challenges.insertOne(createChallenge).then(createChallengeObj => {
        res.format({
            "text/html": function () {
                model.typing_challenges.find({}).toArray().then(typing_challenges => {
                    model.high_scores.find({}).toArray().then(high_scores => {
                        res.render('typing-challenges',{ title: 'challenges', challenges: typing_challenges, high_scores: high_scores});
                    });
                });
            }, 'application/json': function () {
                model.typing_challenges.findOne(createChallenge).then( createChallenge => {
                    res.status(201).json(createChallenge);
                });
            }
        });
    });
});

router.get('/typing/challenges/:id/edit', function (req, res) {

    filter = {
        _id: new ObjectId(req.params.id)
    }
    
    model.typing_challenges.findOne(filter).then(object => {
        model.high_scores.find({}).toArray().then(high_scores => {
            res.format({
                "text/html": function () {
                    res.render('typing-challenges-edit', { title: 'typing', challenges: object, high_scores: high_scores });
                }
            });
        });
    });
});

router.put('/typing/challenges/:id', function (req, res) {
    let createObject = {
        _id : new ObjectId(req.params.id),
        text: req.body.text,
        author: req.body.author,
        level: req.body.level,
        counter : 0
    };

    filter = {
        _id: new ObjectId(req.params.id)
    }

    model.typing_challenges.findOne(filter).then(object => {
        if (object == null) {
            model.typing_challenges.insertOne(createObject).then( () => {
                res.format({
                    'text/html': function() {
                        res.redirect('/games/typing/challenges');
                    }, 'application/json': function() {
                        res.status(201);
                        res.json(createObject);
                    }
                })
            })
        } else {
            model.typing_challenges.replaceOne(filter, createObject, upsert = true).then( () => {
                res.format({
                    'text/html': function() {
                        res.redirect(302, '/games/typing/challenges');
                    }, 'application/json': function() {
                        res.json(createObject);
                    }
                })
            })
        }
    })
});

router.get('/typing/challenges/:id', function (req, res, next) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(404);
        next();
    }
    
    filter = {
        _id: new ObjectId(req.params.id)
    }

    model.typing_challenges.findOne(filter, function(err, obj) {
        if (err) {
            res.status(404);
            next()
        } else if(obj) {
            res.format({
                'application/json': function() {
                    res.status(200).json(obj);
                }
            })
        } else {
            res.status(404);
            next();
        }
    })
});

//bonus 3
router.delete('/typing/challenges/ALL', function(req, res) {
    model.typing_challenges.deleteMany({}).then(result => {
        res.status(204).json(result);
    })
});

router.delete('/typing/challenges/:id', function (req, res) {

    filter = {
        _id: new ObjectId(req.params.id)
    }

    model.typing_challenges.deleteOne(filter).then( result => {
        res.format({
            'text/html' : function() {
                res.redirect(302, '/games/typing/challenges');
            }, 'application/json': function() {
                res.redirect(204, '/games/typing/challenges');
            }
        });
    });
});

router.get('/typing/challenges.js', function (req, res) {
    model.typing_challenges.find({}).toArray().then(typing_challenges => {
        model.high_scores.find({}).toArray().then(high_scores => {
            res.render("typing-challenges-js",  { title: 'challenges', challenges: typing_challenges, high_scores: high_scores });
        });
    });
});


router.post('/random', function (req, res) {
    model.games.find({}).toArray().then(games => {
        let i = Math.random() > 0.5 ? 0 : 1;
        let name= req.body.player;
        console.log(games);
        res.redirect(`${games[i].name}?player=${name}`);
    })
});

