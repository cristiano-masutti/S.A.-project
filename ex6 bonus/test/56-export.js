const should = require('should');
const cheerio = require('cheerio');
const request = require('supertest')("http://localhost:8888");

describe('Task 6. - Play', function() {

    describe('GET /games/typing/challenges.js', function() {

        let challenges;

        it ('export challenges should exist', (done)=>{

            request
                .get('/games/typing/challenges.js')
                .send()
                .expect(200)
                .end(done);

        });

        it ('export challenges should declare variable named challenges with array', (done)=>{

            request
                .get('/games/typing/challenges.js')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        //console.log(res.text);

                        challenges = Function(`${res.text}; return challenges;`)()

                        //console.log(challenges);

                        should.exist(challenges);
                        should(true).be.equal(Array.isArray(challenges));

                        done();

                    }
                });

        });

        it ('export challenges should list edited challenges', (done)=>{

            request
                .get('/games/typing/challenges')
                .send()
                .expect(200)
                .end((err, res) => {
                    if (err) done(err);
                    else {

                        const $ = cheerio.load(res.text);

                        const challenges_html = Array.from($(".list .challenge").map((i, a) => $(a).text()));

                        should(challenges.length).be.equal(challenges_html.length);
                        should(true).be.equal(challenges.every(c=>challenges_html.some(h=>h.indexOf(c)>=0)));

                        done();

                    }
                });

        });

    });

});
