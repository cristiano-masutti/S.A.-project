/**
 * Web Atelier 2022  Exercise 4 - JavaScript on the Server-side
 *
 * Student: CRISTIANO MASUTTI
 *
 * Web Server
 *
 */

/* Quiz 1 */
const http = require("http");

//Useful module to work with the file system
const fs = require("fs-extra");

let site_path = "./public";

/* Quiz 2 */
const tictactoe = require("./modules/play-tictactoe-game");
const { check } = require("fast-check");


function download(urlpath, response) {
    const localPath = site_path + unescape(urlpath)

    /* Quiz 3 */
    const file = fs.createReadStream(localPath);

    file.on('error', function(err) {
        switch (err.code) {
            case 'ENOENT':
                console.log(`File ${localPath} does not exist.`);
                /* Quiz 4 */
                response.writeHead(404);
                response.end();
                break;
            case 'EISDIR':
                /* Quiz 5 */
                response.writeHead(401);
                response.end();
                break;
            default:
                console.log('Error: ' + err);
                throw err;
        }
        return;
    });


    //TODO - the Content-Type should be set depending on the filename extension
    response.writeHead(200);
    
    /* Quiz 6 */
    file.pipe(response);
}


function checkUrl(table) {
    if (table.length != 9) {
        return true;
    }
    for (let i = 0; i < table.length; i++) {
        if (table[i] != 'O' && table[i] != 'X' && table[i] != '_') {
            return true;
        }
    }
    
    return false;
 }

 function createTable(table, player, nextPlayer, urlParameters) {
    let board = "";
    for (let i = 0; i < table.length; i++) {
        if (table[i] === '_' &&  !tictactoe.win(table)) {
            newBoard = createNewBoard(table, i, player);
            if(urlNotPath.length == 1) {
                board += `<b><a href="/tic-tac-toe/${newBoard}/${nextPlayer}">${table[i]}</a></b>`;
            } else {
                board += `<b><a href="/tic-tac-toe/${newBoard}/${nextPlayer}?${urlParameters}">${table[i]}</a></b>`;
            }
        } else {
            board += `<b>${table[i]}</b>`;
        }
    }
    return board;
 }

 function createNewBoard(table, j, player) {
    let board = "";
    for (let i = 0; i < table.length; i++) {
        if (i === j)  {
            board+=player.toUpperCase();
        } else {
            board += table[i];
        }
    }
    return board;
 }

/* Quiz 7 */
function onrequest(request, response) {

//TODO:

//Parse Request URL

    let url = request.url;

    let newUrl = new URL(url, "http://localhost:8888");
    
    let urlPaths = newUrl.pathname.split("/");
    urlNotPath = url.split("?");
    let urlParameters = newUrl.searchParams;
    let scoreX = parseInt(urlParameters.get("scoreX")) || 0;
    let scoreO = parseInt(urlParameters.get("scoreO")) || 0;
    let tie = parseInt(urlParameters.get("ties")) || 0;
    let X = "x";
    let O = "o";
    let nextPlayer = urlPaths[3];

// //Check if the URL path begins with /tic-tac-toe/ (Tasks 3-6)
    if (url.indexOf("/tic-tac-toe/")===0) {
        if (urlPaths.length === 3) {
            player = O;
        } else {
            player = urlPaths[3];
        }
        if (player === O) {
            nextPlayer = X;
        } else {
            nextPlayer = O;
        }
        const table = urlPaths[2];
        if (checkUrl(table)) {
            response.writeHead(400);
            response.end();
        }
        else {
            let message = "";
            let action = "";
            if (tictactoe.win(table)) {
                if (player === X) { 
                    scoreO++;
                    urlParameters.set("scoreO", scoreO);
                } else {
                    scoreX++;
                    urlParameters.set("scoreX", scoreX);
                }
                message = "<b>"+tictactoe.getWinner(table) + " wins</b>";
                action = "win";
            } else if (tictactoe.over(table)) {
                tie++;
                message = "<b> tie </b>";
                urlParameters.set("ties", tie);
                action="tie";
            }

            let board=createTable(table, player, nextPlayer, urlParameters);
            
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(`
            <html>
                <head>
                    <link rel=\"stylesheet\" href=\"http://localhost:8888/play-tictactoe-game.css\">
                </head>
                <body class="${action}">
                    <main>
                        <header>
                            <p class = "scoreX">Player X <span>${scoreX.toString()}</span></p>
                            <p class = "ties">Ties <span>${tie.toString()}</span></p>
                            <p class = "scoreO">Player O <span>${scoreO.toString()}</span></p>
                        </header>
                        <p class="message">${message}</p>
                        <nav>
                            <a href="http://localhost:8888">Reset</a>
                            <a href="http://localhost:8888/tic-tac-toe/_________?${urlParameters}">Continue</a>
                        </nav>
                        <div class="grid">
                        ${board}
                        </div>
                    </main>
                <body>
            </html>
            `);
        }
    }

// //Check if the URL path begins with an existing filename (inside the site_path folder) (Task 3)
    else if (url == "/") {
        response.writeHead(302, {"Location" : "/tic-tac-toe/_________?scoreX=0&scoreO=0&ties=0", "Content-Type" : "text/html"});
        response.end();
    }

    else if (fs.existsSync(site_path+"/"+ url.substring(1))) {
        response.writeHead(200);
        download("/" + url.substring(1), response);
        return;
    }
// //Check if the URL path begins with / (Task 7)
    
    
// //Hint: after deciding what the request is about, call other functions to create the response

// /* Quiz 8 */
    //console.log(url);
    response.writeHead(404); //not found
    response.end();
}
/* Quiz 9 */
http.createServer(onrequest).listen(8888);