/**
 * Web Atelier 2022  Exercise 6 - Persistent Web Apps and APIs with MongoDB
 *
 * Student: __STUDENT NAME__
 *
 * Task 2. Database Tests
 *
 */

const should = require('should');
const request = require('supertest')("http://localhost:8888");

const { model } = require('../model/');

const ObjectId = require('mongodb').ObjectId;

const crypto = require('crypto').webcrypto;

function randomName() {
    return Array.from(crypto.getRandomValues(new Uint8Array(10)), (x) => x.toString(16).padStart(2, "0")).join("").substring(0, 10);
}

function randomInteger(max = 10000) {
    return Math.round(Math.random() * max);
}


describe('Task 6.3. Database', function () {

    //block the tests until the model connects to the database
    before(function (done) {

        let attempts = 0;

        function check() {
            if (model.high_scores && model.typing_challenges) {
                console.log("Test connected to the database")
                done();
            } else {
                console.log("Trying to connect - make sure the database server is running")
                attempts++;
                if (attempts < 10) {
                    setTimeout(check, 500);
                } else {
                    throw "Unable to connect the test to the database";
                }
            }
        }

        check();
    });

    let initial_length;

    describe('GET /games/typing/challenges', function () {

        it('JSON API response should match DB content', (done) => {

            request
                .get('/games/typing/challenges')
                .set('Accept', 'application/json')
                .send()
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    let api = JSON.parse(res.text);

                    should(Array.isArray(api)).be.equal(true);

                    model.typing_challenges.find({}).toArray().then(db => {

                        should(db.length).be.equal(api.length);

                        db.forEach(o => {
                            o._id = o._id.toString();
                        });

                        let join = {}
                        db.forEach(o => {
                            join[o._id] = join[o._id] || {};
                            join[o._id].db = o;
                        });
                        api.forEach(o => {
                            join[o._id] = join[o._id] || {};
                            join[o._id].api = o;
                        });

                        should(db.length).be.equal(Object.keys(join).length);

                        should(true).be.equal(Object.keys(join).every(id => join[id].db != undefined && join[id].api != undefined))

                        Object.keys(join).forEach(id => {
                            should(join[id].api.text).be.equal(join[id].db.text);
                            should(join[id].api.author).be.equal(join[id].db.author);
                            should(join[id].api.level).be.equal(join[id].db.level);
                        })

                        initial_length = db.length;

                        done();
                    });
                });

        });


    });

    let _id;

    let newChallenge = {
        text: randomName(),
        author: randomName().substring(0, 10),
        level: randomInteger(10)
    }

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

        it('challenge database collection should be bigger', function (done) {

            model.typing_challenges.find({}).toArray().then(db => {

                should(initial_length + 1).be.equal(db.length);

            }).then(done, done);

        });


        it('check new database object', function (done) {

            model.typing_challenges.find({ _id: new ObjectId(_id) }).toArray().then(a => {

                let _db = a[0];

                should.exist(_db);

                should(_db.text).be.equal(newChallenge.text);
                should(_db.author).be.equal(newChallenge.author);
                should(_db.level).be.equal(newChallenge.level);

            }).then(done, done);

        });

        it('modify db object and check update is reflected from the API', function (done) {

            let text = randomName();

            model.typing_challenges.updateOne({ _id: new ObjectId(_id) }, { $set: { text } }).then(result => {

                should(result.modifiedCount).be.equal(1);

                request
                    .get('/games/typing/challenges/' + _id)
                    .set('Accept', 'application/json')
                    .send()
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);

                        let c = JSON.parse(res.text);

                        should(c.text).be.equal(text);
                        should(c.author).be.equal(newChallenge.author);
                        should(c.level).be.equal(newChallenge.level);
                        should(c._id).be.equal(_id);

                        done();
                    });

            });

        });

    });

    describe('DELETE /games/typing/challenges/:id', function () {

        it(`delete object from the API and check it is no longer in the database`, function (done) {

            model.typing_challenges.find({ _id: new ObjectId(_id) }).toArray().then(a => {

                should(a.length).be.equal(1);

                request
                    .delete('/games/typing/challenges/' + _id)
                    .set('Accept', 'application/json')
                    .send()
                    .expect(204)
                    .end(function (err, res) {
                        if (err) return done(err);

                        model.typing_challenges.find({ _id: new ObjectId(_id) }).toArray().then(a => {

                            should(a.length).be.equal(0);

                        }).then(done).catch(done);

                    });

            });

        });

    });

});