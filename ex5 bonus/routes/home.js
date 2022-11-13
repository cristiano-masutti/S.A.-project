/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * /index.html router
 *
 */

const express = require('express');
const router = express.Router();
module.exports = router;

const hs = require("../model/high_scores")

router.get('/index.html', function(req, res, next) {
    res.render('index', {title: "index", high_scores : hs.data});
});


