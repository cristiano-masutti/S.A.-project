const should = require('should');
const cheerio = require('cheerio');
const request = require('supertest')("http://localhost:8888");


function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}
const crypto = require('crypto').webcrypto;

function randomName() {
    return Array.from(crypto.getRandomValues(new Uint8Array(10)), (x)=>x.toString(16).padStart(2,"0")).join("").substring(0,10);
}

function randomInteger() {
    return Math.round(Math.random()*10000);
}


describe('Task 4. - Game Over', function() {

    let player = randomName();
    let score = randomInteger();

    describe(`GET /high_scores/game_over?player=${player}&score=${score}`, function() {

        it ('game over page should display player and score', (done)=>{

            request
                .get(`/high_scores/game_over?player=${player}&score=${score}`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    const html_score = $(".score span").text();
                    const html_player = $(".player span").text();

                    should(html_score).be.equal(""+score);
                    should(html_player).be.equal(player);

                    done();

                });

        });

        it ('game over page should contain a form to store the high score', (done)=>{

            request
                .get(`/high_scores/game_over?player=${player}&score=${score}`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($("form[action='/high_scores'][method='post']").html());

                    done();

                });

        });

        it ('game over page should contain a form to store the high score with player and score fields', (done)=>{

            request
                .get(`/high_scores/game_over?player=${player}&score=${score}`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    const form_input_names = Array.from($("form[action='/high_scores'][method='post'] input").map((i, a) => $(a).attr('name')));

                    let expected = [ 'player', 'score' ];

                    should(2).be.equal(form_input_names.filter(x=>expected.indexOf(x)>=0).length);

                    should.exist($("form[action='/high_scores'][method='post'] input[name='player']").html());
                    should.exist($("form[action='/high_scores'][method='post'] input[name='score'][type='hidden']").html());

                    done();

                });

        });

    })

    describe('POST /high_scores', function() {

        let player = randomName();
        let score = randomInteger();

        it ('server should redirect back to the homepage', (done)=>{

            request
                .post('/high_scores')
                .set('Accept', 'text/html')
                .send(`player=${player}&score=${score}`)
                .expect(302)
                .end(function(err, res) {
                    if (err) return done(err);

                    let url = new URL(res.header.location, "http://localhost:8888/");

                    should.exist(url.pathname);
                    should("/index.html").be.equal(url.pathname);

                    done();
                });
        });

        it ('homepage should include contain <aside> or <sidebar>', (done)=>{

            request
                .get('/index.html')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($("aside").html() || $("sidebar").html());

                    done();
                });

        });

        it ('homepage should include player and score within <aside> or <sidebar>', (done)=>{

            request
                .get('/index.html')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    let high_score = $("aside") || $("sidebar");

                    should(true).be.equal(high_score.text().indexOf(player) >= 0);
                    should(true).be.equal(high_score.text().indexOf(""+score) >= 0);

                    done();
                });

        });

    });

});