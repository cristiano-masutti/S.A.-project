/**
 * Web Atelier 2022  Exercise 6 - Persistent Web Apps and APIs with MongoDB
 *
 * Student: __STUDENT NAME__
 *
 * Task 1. API Tests
 *
 */

const should = require('should');
const request = require('supertest')("http://localhost:8888");

function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}

const crypto = require('crypto').webcrypto;

function randomName() {
    return Array.from(crypto.getRandomValues(new Uint8Array(10)), (x) => x.toString(16).padStart(2, "0")).join("").substring(0, 10);
}

function randomInteger(max = 10000) {
    return Math.round(Math.random() * max);
}

describe('Task 6.2. - API', function () {

    let initial_length;

    let _id;

    let newChallenge = {
        text: randomName(),
        author: randomName().substring(0, 10),
        level: randomInteger(10)
    }

    let updatedChallenge = {
        text: randomName(),
        author: randomName().substring(0, 10),
        level: randomInteger(10)
    }

    let otherChallenge = {
        text: randomName(),
        author: randomName().substring(0, 10),
        level: randomInteger(10)
    }

    describe('GET /games/typing/challenges', function () {

        it('should accept and respond with application/json', (done) => {

            request
                .get('/games/typing/challenges')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);

        });

        it('JSON response should be an array', (done) => {

            request
                .get('/games/typing/challenges')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let a = JSON.parse(res.text);

                    should(Array.isArray(a)).be.equal(true);

                    initial_length = a.length;

                    done();
                });

        });

    });

    describe('POST /games/typing/challenges', function () {

        it('should create a new typing challenge', (done) => {

            request
                .post('/games/typing/challenges')
                .set('Accept', 'application/json')
                .send(newChallenge)
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let c = JSON.parse(res.text);

                    should(c.text).be.equal(newChallenge.text);
                    should(c.author).be.equal(newChallenge.author);
                    should(c.level).be.equal(newChallenge.level);

                    //check that there is the mongodb key
                    should.exist(c._id);

                    _id = c._id;

                    done();
                });

        });

        it('challenge list should be bigger', (done) => {

            request
                .get('/games/typing/challenges')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let a = JSON.parse(res.text);

                    should(Array.isArray(a)).be.equal(true);

                    should(initial_length + 1).be.equal(a.length);

                    done();
                });

        });

    });

    describe('GET /games/typing/challenges/:id', function () {

        it('should accept and respond with application/json', (done) => {

            request
                .get('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);

        });

        it('newly created typing challenge should match', (done) => {

            request
                .get('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let c = JSON.parse(res.text);

                    should(c.text).be.equal(newChallenge.text);
                    should(c.author).be.equal(newChallenge.author);
                    should(c.level).be.equal(newChallenge.level);
                    should(c._id).be.equal(_id);

                    done();
                });

        });

        it('a random challenge should be not found ', function (done) {

            request
                .get('/games/typing/challenges/' + randomName().substring(0, 12))
                .send()
                .expect(404, done);
        });

    });

    let newID = '5f428bb8fa5445f1c9ee013b';

    describe('PUT /games/typing/challenges/:id', function () {

        it('should accept and respond with application/json', (done) => {

            request
                .put('/games/typing/challenges/' + _id)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(newChallenge)
                .expect(anyStatus([200, 201]))
                .expect('Content-Type', /json/)
                .end(done);

        });

        it('original challenge should exist', (done) => {

            request
                .get('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let c = JSON.parse(res.text);

                    should(c.text).be.equal(newChallenge.text);
                    should(c.author).be.equal(newChallenge.author);
                    should(c.level).be.equal(newChallenge.level);
                    should(c._id).be.equal(_id);

                    done();
                });

        });

        it('updated challenge should match', (done) => {

            request
                .put('/games/typing/challenges/' + _id)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(updatedChallenge)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let c = JSON.parse(res.text);

                    should(c.text).be.equal(updatedChallenge.text);
                    should(c.author).be.equal(updatedChallenge.author);
                    should(c.level).be.equal(updatedChallenge.level);
                    should(c._id).be.equal(_id);

                    done();
                });

        });

        it('id should not exist before put', function (done) {

            request
                .get('/games/typing/challenges/' + newID)
                .set('Accept', 'application/json')
                .send()
                .expect(404, done)
        });

        it('should create a new challenge with a given id ', function (done) {

            request
                .put('/games/typing/challenges/' + newID)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(otherChallenge)
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let c = JSON.parse(res.text);

                    should(c.text).be.equal(otherChallenge.text);
                    should(c.author).be.equal(otherChallenge.author);
                    should(c.level).be.equal(otherChallenge.level);
                    should(c._id).be.equal(newID);

                    done();
                });
        });

    });

    describe('DELETE /games/typing/challenges/:id', function () {

        it(`should be found before deleting it`, function (done) {

            request
                .get('/games/typing/challenges/' + newID)
                .set('Accept', 'application/json')
                .send()
                .expect(200, done);

        });

        it(`should be found before deleting it`, function (done) {

            request
                .get('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(200, done);

        });

        it(`cleanup posted challenge`, function (done) {

            request
                .delete('/games/typing/challenges/' + newID)
                .set('Accept', 'application/json')
                .send()
                .expect(204, done);

        });

        it(`cleanup newly put challenge`, function (done) {

            request
                .delete('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(204, done);

        });

        it(`should not be found before deleting it`, function (done) {

            request
                .get('/games/typing/challenges/' + newID)
                .set('Accept', 'application/json')
                .send()
                .expect(404, done);

        });

        it(`should not be found before deleting it`, function (done) {

            request
                .get('/games/typing/challenges/' + _id)
                .set('Accept', 'application/json')
                .send()
                .expect(404, done);

        });

        it('deleted challenges should no longer be listed', function (done) {

            request
                .get('/games/typing/challenges/')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/, 'it should respond with Content-Type: application/json')
                .end((err, res) => {
                    if (err) return done(err);

                    const a = JSON.parse(res.text);

                    a.map((o) => o._id).should.not.containEql(_id);
                    a.map((o) => o._id).should.not.containEql(newID);

                    should.not.exist(a.find((o) => o._id == _id));
                    should.not.exist(a.find((o) => o._id == newID));

                    initial_length.should.be.equal(a.length, 'the collection size should shrink back to the original one');

                    done();
                });
        });

    });

    let high_scores_initial_length;

    describe('GET /high_scores', function () {

        it('should accept and respond with application/json', (done) => {

            request
                .get('/high_scores')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);

        });

        it('JSON response should be an array', (done) => {

            request
                .get('/high_scores')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let a = JSON.parse(res.text);

                    should(Array.isArray(a)).be.equal(true);

                    high_scores_initial_length = a.length;

                    done();
                });

        });

    });

    describe('POST /high_scores', function () {

        let newHighScore =
            { player: randomName(), score: randomInteger() }

        let id;

        it('Should create a new high score entry', (done) => {

            request
                .post('/high_scores')
                .set('Accept', 'application/json')
                .send(newHighScore)
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let a = JSON.parse(res.text);

                    should(a.score).be.equal(newHighScore.score);
                    should(a.player).be.equal(newHighScore.player);
                    should.exist(a._id);

                    high_score_id = a._id;

                    done();
                });

        });

        it('added score should be listed', (done) => {

            request
                .get('/high_scores')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let a = JSON.parse(res.text);

                    should(Array.isArray(a)).be.equal(true);

                    should(a.length - 1).be.equal(high_scores_initial_length);

                    should(a.filter(o=>o._id == high_score_id).length).be.equal(1);

                    should(a.filter(o=>o._id == high_score_id)[0].score).be.equal(newHighScore.score);
                    should(a.filter(o=>o._id == high_score_id)[0].player).be.equal(newHighScore.player);

                    done();
                });

        });

    });

});