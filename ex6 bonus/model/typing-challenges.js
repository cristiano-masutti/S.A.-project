/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: CRISTIANO MASUTTI
 *
 * challenges Model
 *
 */

const fs = require('fs-extra');
const path = require('path');

let challenges = [];
let challenges_id = 0;

try {
    o = fs.readJSONSync(path.resolve("./model/challenges.json"));
    challenges = o.challenges;
    challenges_id = o.challenges_id;
} catch (e) { }

function save(){
    fs.writeJSONSync(path.resolve("./model/challenges.json"), {challenges, challenges_id});
}

function nextId() {
    return challenges_id++;
}

module.exports = {
    data: challenges,
    nextId,
    save
}