/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * high_scores Model
 *
 */

const fs = require('fs-extra');
const path = require('path');

let high_scores = [];

try {
    high_scores = (JSON.parse(fs.readFileSync('high_scores.json')));
} catch (e) {
    
}

//load high scores from the .json file on disk
    //TODO
function add(new_score) {
    let i;
    for (i = 0;i < high_scores.length; i++) {
        if (high_scores[i].score < new_score.score) break;
    }
    high_scores.splice(i, 0, new_score);
    save();
}

//write high scores into .json file
function save() {
    fs.writeFileSync('high_scores.json', JSON.stringify(high_scores));
}

module.exports = {
    data: high_scores,
    add
}