const should = require('should');
const cheerio = require('cheerio');
const request = require('supertest')("http://localhost:8888");


function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}
const crypto = require('crypto').webcrypto;

function randomText() {
    return Array.from(crypto.getRandomValues(new Uint8Array(10)), (x) => x.toString(16).padStart(2, "0")).join("");
}

function randomInteger(max = 10000) {
    return Math.round(Math.random() * max);
}


describe('Task 5. - Edit Typing Challenges', function () {

    let initial_count;
    let created_count;
    let updated_count;

    describe(`GET /games/typing/challenges`, function () {

        it('should list the available challenges', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    initial_count = Array.from($(".list .challenge")).length;

                    done();

                });

        });

        it('should include a form to create a new challenge', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($("form[action='/games/typing/challenges'][method='post']").html());

                    done();

                });

        });

        it('should include a form to create a new challenge with the text, author, level fields', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($("form[action='/games/typing/challenges'][method='post'] input[name='text']").html());
                    should.exist($("form[action='/games/typing/challenges'][method='post'] input[name='author']").html());
                    should.exist($("form[action='/games/typing/challenges'][method='post'] input[name='level']").html());

                    done();

                });

        });

    });

    let text = randomText();
    let author = randomText().substring(10);
    let level = randomInteger(10);

    let put_href;

    describe(`POST /games/typing/challenges`, function () {

        it('should create a new challenge when submitting the form', (done) => {

            request
                .post(`/games/typing/challenges`)
                .send(`text=${text}&author=${author}&level=${level}`)
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    updated_count = Array.from($(".list .challenge")).length;

                    should(updated_count).be.equal(initial_count + 1);

                    const list = Array.from($(".list .challenge").map((i, a) => $(a).text()));

                    should(true).be.equal(list.some(t => t.indexOf(text) >= 0));

                    done();

                });

        });

        it('should list the newly added challenge', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    created_count = Array.from($(".list .challenge")).length;

                    should(created_count).be.equal(initial_count + 1);
                    should(updated_count).be.equal(created_count);

                    const list = Array.from($(".list .challenge").map((i, a) => $(a).text()));

                    should(true).be.equal(list.some(t => t.indexOf(text) >= 0));

                    done();

                });

        });

    });

    describe(`GET /games/typing/challenges/:id/edit`, function () {

        let edit_href;

        it('challenge list should include edit link', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    const list = Array.from($(".list .challenge a").map((i, a) => $(a).attr('href')));

                    should(true).be.equal(list.length > 0);
                    should(true).be.equal(list.some(l => l.endsWith("/edit")));

                    //assumes that the newly added entry is the last link
                    edit_href = list.filter(l => l.endsWith("/edit")).pop();

                    done();

                });

        });

        it('edit form should include the same fields as the create form', (done) => {

            //assumes /games/typing/challenges/${id}/edit

            put_href = edit_href.replace("/edit", "");

            request
                .get(edit_href)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(`form[action='${put_href}?_method=PUT' i][method='post']`).html());
                    should.exist($(`form[action='${put_href}?_method=PUT' i][method='post'] input[name='text']`).html());
                    should.exist($(`form[action='${put_href}?_method=PUT' i][method='post'] input[name='author']`).html());
                    should.exist($(`form[action='${put_href}?_method=PUT' i][method='post'] input[name='level']`).html());

                    done();

                });

        });


    });

    describe(`PUT /games/typing/challenges/:id`, function () {

        let new_text = randomText();
        let new_author = randomText().substring(10);
        let new_level = randomInteger(10);

        it('should redirect to the challenge list when submitting the edit form', (done) => {

            request
                .put(put_href)
                .send(`text=${new_text}&author=${new_author}&level=${new_level}`)
                .expect(302)
                .expect('Location', '/games/typing/challenges')
                .end(done);

        });

        it('should list the updated challenge text', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    let count = Array.from($(".list .challenge")).length;

                    should(count).be.equal(initial_count + 1);
                    should(updated_count).be.equal(count);

                    const list = Array.from($(".list .challenge").map((i, a) => $(a).text()));

                    should(false).be.equal(list.some(t => t.indexOf(text) >= 0));
                    should(true).be.equal(list.some(t => t.indexOf(new_text) >= 0));

                    done();

                });

        });


    });


    describe(`DELETE /games/typing/challenges/:id`, function () {

        let before_count;

        it('should list the available challenges', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    before_count = Array.from($(".list .challenge")).length;

                    done();

                });

        });

        it('should include a delete form for each challenge', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    let items_count = Array.from($(".list .challenge")).length;

                    let form_count = Array.from($(".list .challenge form[method='post'][action^='/games/typing/challenges/']")).length;

                    should(form_count).be.equal(items_count);

                    let delete_count = Array.from($(".list .challenge form[method='post'][action$='_method=delete' i]")).length;

                    should(form_count).be.equal(delete_count);

                    done();

                });

        });

        it('should redirect to the challenge list after deleting item', (done) => {

            request
                .delete(put_href)
                .send()
                .expect(302)
                .expect('Location', '/games/typing/challenges')
                .end(done);

        });

        it('deleted challenge should disappear', (done) => {

            request
                .get(`/games/typing/challenges`)
                .set('Accept', 'text/html')
                .send()
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);

                    const $ = cheerio.load(res.text);

                    should.exist($(".list").html())
                    let after_count = Array.from($(".list .challenge")).length;

                    should(after_count).be.equal(before_count - 1);
                    should(initial_count).be.equal(after_count);

                    done();

                });

        });


    });


});