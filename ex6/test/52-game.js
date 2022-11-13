const should = require('should');
const request = require('supertest')("http://localhost:8888");

function anyStatus(a) {
    return (res) => {
        if (a.indexOf(res.status) == -1) throw new Error(`Received ${res.status}; Expected ${a.join(" or ")}`);
    }
}

describe('Task 2. - Serve Game Assets', function() {



    describe('GET /index.html', function() {

        it ('should exist', (done)=>{

            request
                .get('/index.html')
                .set('Accept', 'text/html')
                .send()
                .expect(anyStatus([200,301,302]))
                .expect('Content-Type', /html/)
                .end(done);

        });

    })


    describe('GET /games/typing/', function() {

        it ('should exist', (done)=>{

            request
                .get('/games/typing/')
                .set('Accept', 'text/html')
                .send()
                .expect(anyStatus([200,301,302]))
                .expect('Content-Type', /html/)
                .end(done);

        });

    })


    describe('GET /games/snake/', function() {

        it ('should exist', (done)=>{

            request
                .get('/games/snake/')
                .set('Accept', 'text/html')
                .send()
                .expect(anyStatus([200,301,302]))
                .expect('Content-Type', /html/)
                .end(done);

        });

    })


});