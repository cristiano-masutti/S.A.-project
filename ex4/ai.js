const { func } = require("fast-check");
let tictactoe = require("./modules/play-tictactoe-game");

//bonus 
function dumb_ai(s) {
    if (getFreeSpaces(s) < 9)
    {
        while(true) {
            let i = Math.floor(Math.random() * 10);
            if (s[i] == '_') {
                return i;
            }
        }
    }
    return;
}


function great_ai(s) {
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '_') {
            if (tictactoe.win(possibleBoard(s, i, 'x'))) {
                return i;
            }
        }
    }
    return dumb_ai(s);
}

function possibleBoard(s, j, player) {
    let board = "";
    for (let i = 0; i < s.length; i++) {
        if (i === j)  {
            board+=player.toUpperCase();
        } else {
            board += s[i];
        }
    }
    return board;
}

function getFreeSpaces(s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i]==='_') {
            count++;
        }
    }
    return count;
}



exports.dumb_ai = dumb_ai;
exports.great_ai = great_ai;