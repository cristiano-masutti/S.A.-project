

const EMPTY = "_";
let win_p = "";

/**
 * Determine if the board has a winning configuration
 * @param {String} s encoding the board slots
 * @returns true, if the game has a winner. false otherwise.
 */
function win(s) {
    s = Array.from(s);
    let m =[[s[0],s[1],s[2]],[s[3],s[4],s[5]],[s[6],s[7],s[8]]];
    for(let i = 0; i < m.length; i++) {
        if (m[0][i] == m[1][i] && m[2][i]==m[1][i] && m[1][i] != EMPTY) {
            win_p = m[0][i];
            return true;
        }
        if (m[i][0] == m[i][1] && m[i][2]==m[i][0] && m[i][0] != EMPTY) {
            win_p = m[i][0];
            return true;
        }
    }
    if ((m[0][0] == m[1][1] && m[1][1] == m[2][2] && m[1][1]!=EMPTY) ||
        (m[0][2] == m[1][1] && m[1][1] == m[2][0] && m[1][1]!=EMPTY)) {
            win_p=m[1][1];
            return true;
        }
    return false;
}

/**
 * Determine if the board has no more empty slots
 * @param {String} s encoding the board slots
 * @returns true, if the game is over. false, there are empty slots and more moves can be made.
 */
function over(s) {
    s = Array.from(s);
    for(let i = 0; i < s.length; i++) {
        if (s[i] == EMPTY) {
            return false;
        }
    }
    return true;
}



function getWinner(s) {
    if (win(s)) {
        return win_p;
    } 
    return;
}

exports.win = win;
exports.over = over;
exports.getWinner = getWinner;



