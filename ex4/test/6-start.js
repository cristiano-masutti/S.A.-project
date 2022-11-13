const request = require('supertest')("http://localhost:8888");
const cheerio = require('cheerio');
const should = require('should');

describe('Task 7: Redirect to start the game', function() {

    it('GET / redirects to the game initial page', function(done) {

        request
            .get('/')
            .send()
            .expect(302)
            .expect('Location', "/tic-tac-toe/_________?scoreX=0&scoreO=0&ties=0")
            .end(done);

    });

});