/**
 * Web Atelier 2022 3 - Object-Oriented JavaScript
 *
 * Automated Tests Cases
 *
 */

function loadGame(player, check) {
    let x = document.querySelector("iframe");
    x.src = "play-snake-game.html?player=" + player;
    x.onload = function () {
        var y = (x.contentWindow || x.contentDocument);

        check(y.document, y);
    }
}


function randomName() {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(10)), (x)=>x.toString(16).padStart(2,"0")).join("")
}



describe('Task 1', function () {

    describe('Game class', function () {

        it("should store and display the player name, game score and health", function() {

            fc.assert(fc.property(fc.domain({size: '-1'}), fc.integer(), fc.integer(), fc.integer(), ((name,score,health,time)=>{

                let game = new Game(name);
                should(name).be.equal(game.player);

                should(name.trim()).be.equal(document.querySelector(".player span").innerText.trim());

                game.score = score;
                should(score).be.equal(parseInt(document.querySelector(".score span").innerText));

                game.health = health;
                should(health+"%").be.equal(document.querySelector(".health span").innerText);

            })))

        });

    });


    describe('CanvasGame class', function () {

        it("should clear the canvas when started", function(done) {

            let canvas = document.querySelector("canvas");
            let ctx = canvas.getContext("2d");

            let canvasgame = new CanvasGame("Canvas", canvas);
            canvasgame.startGame();

            let count = 10;
            let check = [];

            let timer = setInterval(()=>{

                let x = Math.round(Math.random()*canvas.width);
                let y = Math.round(Math.random()*canvas.height);

                ctx.fillStyle = "white";
                ctx.fillRect(x-1,y-1,2,2);

                setTimeout(()=>{

                    const data = ctx.getImageData(0,0,canvas.width-1,canvas.height-1).data;

                    let c = {};

                    for (var i = 0; i < data.length; i += 4) {
                        var key = data[i] + '-' + data[i+1] + '-' +
                                  data[i+2];

                        if (c[key]){
                            c[key]++;
                        } else {
                            c[key] = 1;
                        }
                    }

                    console.log(c);

                    check.push(Object.keys(c).length == 1);

                }, 50);

                if (check.length > count) {
                    clearInterval(timer);
                    canvasgame.stopGame();

                    should(true).be.equal(check.some(c=>c));

                    done();
                }

            },50);

        });

    });


    describe('SnakeGame class', function () {

        it("should initialize the food when created", function() {

            let canvas = document.querySelector("canvas");

            let game = new SnakeGame("Snake", canvas);

            should.exist(game.food);

        });

        it("tick() should eat the food", function() {

            let canvas = document.querySelector("canvas");

            let game = new SnakeGame("Snake", canvas);

            //ensure there is some food on the table
            game.food_tick();

            //place the food in front of the snake
            let x = game.snake.position[0].x;
            let y = game.snake.position[0].y;

            if (Array.isArray(game.food)) {
                game.food[0].position.x = x + game.snake.velocity.dx;
                game.food[0].position.y = y + game.snake.velocity.dy;
            } else {
                game.food.position.x = x + game.snake.velocity.dx;
                game.food.position.y = y + game.snake.velocity.dy;
            }

            let old_score = game.score;
            let old_length = game.snake.length;

            //move the snake
            game.tick();

            //check the snake ate the food
            should(old_score).not.be.equal(game.score);
            should(old_length).not.be.equal(game.snake.length);

        });

    });

    describe('Snake class', function () {

        it("should grow after eating the food", function() {

            let canvas = document.querySelector("canvas");

            let snake = new Snake(10);

            snake.eat(new Food({ left: 0, top: 0, width: canvas.width, height: canvas.height }));

            should(10).be.not.equal(snake.length);


        });
    });

    describe('Food class', function () {

        it("hit() should detect when the snake overlaps", function() {

            let canvas = document.querySelector("canvas");

            let food = new Food({ left: 0, top: 0, width: canvas.width, height: canvas.height });

            let snake = new Snake(10, {...food.position});

            should(true).be.equal(food.hit(snake));

        });

        it("hit() should detect when the horizontally moving snake overlaps", function() {

            let canvas = document.querySelector("canvas");

            let food = new Food({ left: 0, top: 0, width: canvas.width, height: canvas.height });

            let snake = new Snake(10, {...food.position}, { dx: 1, dy: 0 }, { left: 0, top: 0, width: canvas.width, height: canvas.height });

            // console.log(snake.position, food.position, food.size, food.hit(snake));
            should(true).be.equal(food.hit(snake));

            for (let x = food.position.x; x <= food.position.x + food.size.w + snake.length -1; x++) {
                should(true).be.equal(food.hit(snake));
                snake.move();
                // console.log(snake.position, food.position, food.size, food.hit(snake));
            }
            should(false).be.equal(food.hit(snake));

        });

        it("hit() should detect when the vertically moving snake overlaps", function() {

            let canvas = document.querySelector("canvas");

            let food = new Food({ left: 0, top: 0, width: canvas.width, height: canvas.height });

            let snake = new Snake(10, {...food.position}, { dx: 0, dy: 1 }, { left: 0, top: 0, width: canvas.width, height: canvas.height });

            // console.log(snake.position, food.position, food.size, food.hit(snake));
            should(true).be.equal(food.hit(snake));

            for (let y = food.position.y; y <= food.position.y + food.size.h + snake.length -1; y++) {
                should(true).be.equal(food.hit(snake));
                snake.move();
                // console.log(snake.position, food.position, food.size, food.hit(snake));
            }
            should(false).be.equal(food.hit(snake));

        });

    });

});

describe('Task 2', function () {

    it("food_tick() should move the food", function() {

        let canvas = document.querySelector("canvas");

        let game = new SnakeGame("Snake", canvas);

        let initial_food_position = {...game.food.position};

        game.food_tick();

        should(initial_food_position).be.not.deepEqual(game.food.position);

    });

});


describe('Task 4', function () {

    describe('Player Name', function () {

        it("should display player name from URL", function (done) {

            let player = randomName();

            loadGame(player, doc => {

                should(player).be.equal(doc.querySelector(".player span").innerText);

                done();

            });

        })


    });

});

describe('Task 3', function () {

    describe('High Scores', function () {

        function getHighScore(f) {

            loadGame("P", (doc, w) => {

                let high_scores = w.localStorage.getItem("high_scores");

                f(w.localStorage, high_scores, doc, w)

            });
        }

        it("localStorage should contain valid JSON", function (done) {

            getHighScore((localStorage, high_scores) => {
                try {

                    should.exist(high_scores);

                    (JSON.parse(high_scores)).should.not.throw();

                    done();

                } catch (e) {
                    done(e);
                }

            });

        });

        it("localStorage should contain high_scores Array", function (done) {

            getHighScore((localStorage, high_scores) => {
                try {

                    should.exist(high_scores);

                    let a = JSON.parse(high_scores);

                    should(true).be.equal(Array.isArray(a));

                    done();

                } catch (e) {
                    done(e);
                }

            });

        });

        it("localStorage should contain Array of game results", function (done) {

            getHighScore((localStorage, high_scores) => {
                try {

                    should.exist(high_scores);

                    let a = JSON.parse(high_scores);

                    a.forEach(o=>{

                        should.exist(o.score);
                        should.exist(o.player);
                        should.exist(o.time);

                    });

                    done();

                } catch (e) {
                    done(e);
                }

            });

        });


        it("game HTML page should contain <aside> or <sidebar>", function (done) {

            getHighScore((localStorage, high_scores, doc) => {
                try {

                    should.exist(doc.querySelector("aside") || doc.querySelector("sidebar"));

                    done();

                } catch (e) {
                    done(e);
                }

            });

        });

        it("after a game the new high score should be added", function (done) {

            getHighScore((localStorage, high_scores, doc) => {
                try {

                    let e = doc.querySelector("aside") || doc.querySelector("sidebar");

                    should.exist(high_scores);

                    let backup = localStorage.getItem("high_scores") || "[]";

                    let a = JSON.parse(high_scores);

                    let old_length = a.length;

                    let old_content = e.innerHTML;

                    let game = new Game("High Score "+randomName());

                    game.startGame();

                    game.score = 100000001 + Math.round(Math.random()*10000); //super high score
                    game.health = -1; //game over

                    getHighScore((localStorage, high_scores) => {

                        //restore old value
                        localStorage.setItem("high_scores", backup);

                        should.exist(high_scores);

                        let b = JSON.parse(high_scores);

                        should(old_length + 1).be.equal(b.length);

                        //new game score should be in the high_scores

                        let position = b.findIndex(x=>x.score == game.score && x.player == game.player);

                        should(true).be.equal(position >= 0);

                        let e = doc.querySelector("aside") || doc.querySelector("sidebar");

                        let new_content = e.innerHTML;

                        should(old_content).be.not.equal(new_content);

                    });

                    done();

                } catch (e) {
                    done(e);
                }

            });

        });

        it("<aside> or <sidebar> content should change after adding high score results", function (done) {

            getHighScore((localStorage, high_scores, doc, w) => {
                try {

                    let e = doc.querySelector("aside") || doc.querySelector("sidebar");

                    let old_content = e.innerHTML;

                    high_scores = high_scores || "[]";

                    high_scores = JSON.parse(high_scores);

                    high_scores.push({score: Math.round(Math.random()*1000), player: "Test", time: performance.now()});

                    let backup = localStorage.getItem("high_scores") || "[]";

                    //change high_scores
                    localStorage.setItem("high_scores", JSON.stringify(high_scores));

                    //reload page
                    getHighScore((localStorage, high_scores, doc, w) => {

                        //restore old value
                        localStorage.setItem("high_scores", backup);

                        let e2 = doc.querySelector("aside") || doc.querySelector("sidebar");

                        let new_content = e2.innerHTML;

                        should(old_content).not.be.equal(new_content);

                        done();

                    });

                } catch (e) {
                    done(e);
                }

            });

        });

    });

})

