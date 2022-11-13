/**
 * Web Atelier 2022  Exercise 6 - Persistent Web Apps and APIs with MongoDB
 *
 * Student: CRISTIANO MASUTTI
 *
 * /index.html router
 *
 */

const express = require('express');
const router = express.Router();
module.exports = router;



let { model } = require("../model/");

router.get('/', (req, res) => {
    res.redirect("index.ejs");
})


router.get("/index.html", (req, res) => {

    /* Quiz 11 */
    model.high_scores.find({}).toArray().then(high_scores => {

        res.render("index.ejs", { high_scores: high_scores });

    });

});
