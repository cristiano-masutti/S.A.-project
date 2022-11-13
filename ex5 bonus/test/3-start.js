const should = require('should');
const cheerio = require('cheerio');
const request = require('supertest')("http://localhost:8888");
const fc = require('fast-check');

function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}
const crypto = require('crypto').webcrypto;

function randomName() {
    return Array.from(crypto.getRandomValues(new Uint8Array(10)), (x)=>x.toString(16).padStart(2,"0")).join("")
}


describe('Task 3. - Start Random Game', function() {

    describe('GET /index.html', function() {

        it ('homepage should contain form targeting /games/random', (done)=>{

            request
                .get('/index.html')
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($("form[action='/games/random'][method='post']").html());

                    done();

                });

        });

    })

    describe('POST /games/random', function() {

        it ('server should redirect to a random game URL', (done)=>{

            request
                .post('/games/random')
                .send()
                .expect(302)
                .end(function(err, res) {
                    if (err) return done(err);

                    let url = new URL(res.header.location, "http://localhost:8888/");

                    should.exist(url.pathname);
                    should(true).be.equal(["/typing","/snake"].some((el) => url.pathname.includes(el)))

                    done();
                });
        });

        it ('server redirect should preserve player query string parameter value', (done)=>{

            let player = randomName();

            request
                .post('/games/random')
                .send('player='+player)
                .expect(302)
                .end(function(err, res) {
                    if (err) return done(err);

                    let url = new URL(res.header.location, "http://localhost:8888/");

                    should.exist(url.searchParams.get('player'));
                    should(url.searchParams.get('player')).be.equal(player);

                    done();
                });

        });


    })

});