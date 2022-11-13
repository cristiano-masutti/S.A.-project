const request = require('supertest')("http://localhost:8888");
const cheerio = require('cheerio');
const should = require('should');
const fc = require('fast-check');

function rnd_it(s, f) {
    //speed up the test
    if (Math.random()<0.01) {
        it(s,f);
    }
}


describe('Task 6: Track score', function() {

    it('Web server should be started, listening on port 8888', function(done) {

        request
            .get('/')
            .send()
            .end(done);

    });

    describe('GET /tic-tac-toe/{s}?scoreX={number}&scoreO={number}&ties={number}', function() {


        fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), (num_o, num_x, num_tie) => {

            it(`GET /tic-tac-toe/____O____?scoreX=${num_o}&scoreO=${num_x}&ties=${num_tie} returns 200 OK, with an HTML page that includes the score`, function(done) {

                request
                    .get(`/tic-tac-toe/____O____?scoreX=${num_x}&scoreO=${num_o}&ties=${num_tie}`)
                    .send()
                    .expect(200)
                    .end((err, res) => {
                        if (err) done(err);
                        else {

                            const $ = cheerio.load(res.text);

                            const scoreX = $(".scoreX span").text();
                            const scoreO = $(".scoreO span").text();
                            const ties = $(".ties span").text();

                            should(parseInt(scoreX)).be.equal(num_x);
                            should(parseInt(scoreO)).be.equal(num_o);
                            should(parseInt(ties)).be.equal(num_tie);

                            done();

                        }
                    });

            });

        }));

    });


    describe('GET /tic-tac-toe/{s}?scoreX={number}&scoreO={number}&ties={number}', function() {


        fc.assert(fc.property(fc.nat(), fc.nat(), fc.nat(), (num_o, num_x, num_tie) => {

            it(`GET /tic-tac-toe/_________?scoreX=${num_o}&scoreO=${num_x}&ties=${num_tie} returns 200 OK, with an HTML page that includes the score in all of its links`, function(done) {

                request
                    .get(`/tic-tac-toe/_________?scoreX=${num_x}&scoreO=${num_o}&ties=${num_tie}`)
                    .send()
                    .expect(200)
                    .end((err, res) => {
                        if (err) done(err);
                        else {

                            const $ = cheerio.load(res.text);

                            let href = Array.from($("a").map((i, a) => $(a).attr('href')));

                            href = [href.filter(link=>link.startsWith("/tic-tac-toe")), href.filter(link=>!link.startsWith("http"))].flat();

                            let url = new URL("http://localhost/");

                            href.forEach(link=>{
                                let link_url = new URL(link, url);

                                //outgoing link has the score search parameters
                                should(true).be.equal(link_url.searchParams.has("scoreX"));
                                should(true).be.equal(link_url.searchParams.has("scoreO"));
                                should(true).be.equal(link_url.searchParams.has("ties"));

                                //outgoing link preserves the score parameter values
                                const scoreX = link_url.searchParams.get("scoreX");
                                const scoreO = link_url.searchParams.get("scoreO");
                                const ties = link_url.searchParams.get("ties");

                                //ignore the reset link
                                if (scoreX != "0" && scoreO != "0" && ties != "0") {

                                    should(parseInt(scoreX)).be.equal(num_x);
                                    should(parseInt(scoreO)).be.equal(num_o);
                                    should(parseInt(ties)).be.equal(num_tie);

                                }

                            })

                            done();

                        }
                    });

            });

        }));

    });

});