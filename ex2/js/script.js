/**
 * Web Atelier 2022 2 - JavaScript
 *
 * Student: CRISTIANO MASUTTI
 *
 */

//--------------------------------------------------------------------------------------
// Task 1
//--------------------------------------------------------------------------------------

/**
 * @param {number} s - A time as the number of seconds.
 * @return {string} A string which represents the number of minutes followed by the remaining seconds
 *  with the M:SS.MS format. If the input value is negative, the resulting string should be in -M:SS.MS format.
 * SS indicates that if the number of seconds is less than 10, it should be padded with a 0 character.
 * MS indicates the number of milliseconds (3 digits)
 */
 function format_seconds(s) {
    if (isNaN(s) || typeof(s) !== "number")  {
        return "?:??.????";
    }
    if (s == 0) {
        return "0:00.000";
    }
    else if (s < 0) {
        return "-"+format_seconds(-s);
    }
    else {
        let min = Math.trunc(s / 60);
        let sec = (Math.trunc(s % 60).toString()).padStart(2,"0");
        let millisec = Math.round((1000 * (s - Math.trunc(s))).toFixed(3));
        return min+":"+sec+"."+millisec;
    }
}





/**
* @param {Number[]} a - The array of numbers.
* @param {Number} c - The scalar multiplier.
* @return {Number[]} An array computed by multiplying each element of the input array `a`
* with the input scalar value `c`.
*/
function scalar_product(a, c) {
    if (Array.isArray(a) && !isNaN(c)) {
        let arr=[]
        for (let i = 0; i < a.length; i+=1) {
            arr.push(a[i]*c);
        }
        return arr;
    }
    return undefined;
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */
function inner_product(a, b) {
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
        let result = 0;
        for(let i = 0; i < a.length; i+=1) {
            result = a[i]*b[i];
        }
        return result;
    }
    return undefined;
}


/**
* @param {String} a - A string typed by the user
* @param {String} b - The correct string
* @return {Array[Boolean]} Array indicating whether the corresponding characters are wrong: (true = mismatch detected, false = identical characters).
*/
function getErrors(a, b) {
    logFunctionArguments(arguments);
    if (typeof(a) === 'string' && typeof(b)==='string') {
        let result = [];
        for (let i = 0; i < a.length; i+=1) {
            if (a[i] == b[i]) {
                result.push(false);
            } else {
                result.push(true);
            }
        }
        return result;
    }
    return undefined;
    
}



/**
* @param {String} a - A string typed by the user
* @param {String} b - The correct string
* @return {Integer} The number of mismatching characters. Case sensitive.
*/
function countErrors(a, b) {
    if(typeof(b) == 'string') {
        let count = 0;
        for (let i = 0; i < a.length; i+=1) {
            if (a[i] != b[i]) {
                count+=1;
            }
        }
        return count;
    }
    return undefined;
}

/**
 * Detect whether the point at coordinates (x,y) is found within the given rectangle
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} left
 * @param {Integer} top
 * @param {Integer} width
 * @param {Integer} height
 * @returns {Boolean} true, if the point is located inside (including the edge), false outside
 */
function detectCollisionRect(x, y, left, top, width, height) {
    let yPosition = y >= top && y <= (top+height);
    let xPosition = x >= left && x <= (left+width);
    return yPosition && xPosition;
}

/**
 * Detect whether the point at coordinates (x,y) is found within any of the given rectangles
 * @param {Integer} x
 * @param {Integer} y
 * @param {Array} a Array of rectangles. Each rectangle is an array of 4 elements: [left, top, width, height].
 * @returns
 */
function detectCollisionRectArray(x, y, a) {
    if (!Array.isArray(a) || a.length==0) {
        return undefined;
    }
    for(let i = 0; i < a.length; i+=1) {
        if (detectCollisionRect(x, y, a[i][0], a[i][1], a[i][2], a[i][3])) {
            return true;
        }
    }
    return false;
}



//--------------------------------------------------------------------------------------
// Task 2
//--------------------------------------------------------------------------------------


/**
* @param {string} t0 - A timestamp
* @return {function(t)} A function which given a timestamp t computes the time elapsed since the initial timestamp t0.
*/
function startClock(t0) {
    if (!isNaN(t0)) {
        return function getElapsedTime (t1) {
            return t1-t0;
        }
    }
    return;
    }
    


/**
 * @param {number[]} a - The array over which to iterate.
 * @return {function} - call this function to retrieve the next element of the array. The function throws an error if called again after it reaches the last element.
 */
function iterator(a) {
    if (!Array.isArray(a)) {
        return;
    }
    let i = 0;
    return function next(newValue) {
        if (i>= a.length) {
            throw new Error("Exceded Limits");
        }
        if (Array.isArray(newValue)) {
            i = 0;
            return next;
        }
        if (typeof(newValue) == 'number') {
            if (newValue == 0) {
                return i;
            } if (newValue == -1) {
                return a[i--]
            }
        }
        return a[i++];
    }
}



/**
 * @param {event} a - The click event
 * @return undefined;
 */
function button_start_click(event) {
    //start the clock
    
    getElapsedTime = startClock(performance.now());

    //start the timer event
    stopTimer = startTimer(tick);

    //pick a random text challenge and display it
    challenge = pickRandomChallenge();
    displayChallenge(challenge);

    //get the <input> ready for the next round
    emptyInput();
    focusInput();
    input_text.style.opacity = 1;
    //reset the score
    score();
}



/**
 * @param {event} a - The input event
 * @return undefined;
 */
function txt_input(event) {
    //game over when input matches challenge length
    let input = event.target.value;
    let len = input.length;
    if (len === challenge.length) {
        gameOver();
    }

    //count errors and display them
    let errorcounts = countErrors(input, challenge);
    displayErrors((challenge.length - errorcounts) / challenge.len)

    score();
    let errors = countErrors(input, challenge);
    health = errors/len;
    if (isNaN(health)) {
        displayErrors(1);
    } else {
       displayErrors(1-health);
    }

    //update the score based on the errors
    score(len-errors);

    //redisplay the challenge string to highlight the errors
    let redisplay = getErrors(input,challenge);
    displayChallenge(challenge, redisplay);   
}


/**
 * Helper function to print a log message with the function call performed by the tests
 *
 * usage:
 *
 * logFunctionArguments(arguments);
 */
 function logFunctionArguments(a){

    console.log(`${a.callee.name}(${Array.from(a).map(j=>JSON.stringify(j)).join(", ")})`)

}
