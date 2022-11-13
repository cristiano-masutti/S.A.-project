/**
 * Web Atelier 2022 2 - JavaScript
 *
 * Student: CRISTIANO MASUTTI
 *
 */

//--------------------------------------------------------------------------------------
// Task 3
//--------------------------------------------------------------------------------------

/*** Quiz 1 ***/
function pickRandomChallenge() {
    
    /*** Quiz 2 ***/
    // let challenges = [
    //     "quick brown fox jumps over the lazy dog",
    //     "HTML/CSS/JavaScript",
    //     "abcdefghijklmnopqrstuvwxyz",
    //     "one of the toughest macroeconomic conditions underway",
    //     "a mixture of commercial online services, university networks, and local community networks mutated into something bigger",
    //     "Between 1994 and 1995, the World Wide Web became the public face of cyberspace",
    //     "an internet where people are in control of their information at all times",
    //     "Consumer behavior, recorded on centralized company servers, offered insight into how to monetize human emotion and attention",
    //     "an economy that is imagined, produced and owned by its creators",
    //     "researchers studying robustness, generalization, capabilities, biases and constraints of the current model"
    // ]

    /*** Quiz 3 ***/
    return challenges[Math.floor(Math.random() * challenges.length)];
}

/*** Quiz 4 **/
function tick() {

/*** Quiz 5 ***/
    let dt = getElapsedTime(performance.now()); //ms

    displayTime(dt / 1000); //seconds

}

/*** Quiz 6 ***/
function startTimer(f, i = 10) {

    /*** Quiz 7 **/
    let interval = setInterval(f, i);

    /*** Quiz 8 ***/
    return function stopTimer() {
        clearInterval(interval);
    };
}

/*** Quiz 9 ***/
let stopTimer;

let getElapsedTime;

let challenge;

/*** Quiz 10 ***/
let score = (function () {

    /*** Quiz 11 ***/
    let score = 0;

    return function (n) {

        if (n === undefined) {

            score = 0;

        } else {

            score += n;

        }

        displayScore(score);

    }

/*** Quiz 12 ***/
})();

/*** Quiz 13 ***/
function gameOver() {
    stopTimer();

    button_start.focus();

    let url = window.location;
    let new_url = new URL(url);
    let player = new_url.searchParams.get("player");

    window.location.assign(`http://localhost:8888/high_scores/game_over?player=${player}&score=${document.querySelector('.score span').innerHTML}&time=${document.querySelector('.time span').innerHTML}`);
}


/*** Quiz 14 ***/
let button_start = document.querySelector('button[data-action="start"]');
button_start.addEventListener("click", button_start_click);


/*** Quiz 15 ***/
let input_text = document.querySelector('#txt');
input_text.addEventListener("input", txt_input);

/*** Quiz 16 ***/
function displayTime(s) {
    document.querySelector(".time span").innerHTML = format_seconds(s);
}

/*** Quiz 17 ***/
function displayChallenge(s, errors) {

    if (errors !== undefined) {

        s = Array.from(s).map((c, i) =>

            '<span class="' + (errors[i] == undefined ? "undef" : errors[i] ? "error" : "ok") + '">' + c.replace(" ", "&nbsp;") + "</span>"

        ).join("");

    }

    document.querySelector(".challenge").innerHTML = s;
}

/*** Quiz 18 ***/
function displayErrors(s) {
    document.querySelector(".health span").innerHTML = Math.round(s * 100) + "%";
}

/*** Quiz 19 ***/
function displayScore(s) {
    document.querySelector(".score span").innerHTML = ( s < 0 ? "-" : "" ) + String(Math.round(Math.abs(s))).padStart(6, '0');
}

/*** Quiz 20 ***/
function focusInput() {
    input_text.focus();
}

/*** Quiz 21 ***/
function emptyInput() {
    input_text.value = "";
}

// bonus 1
let button_quit = document.querySelector('button[data-action="quit"]');
button_quit.addEventListener("click", gameOver);