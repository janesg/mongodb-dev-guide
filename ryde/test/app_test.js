const assert = require('assert');

// By convention, we use request as the required const for supertest
const request = require('supertest');

const app = require('../src/app');

describe('The express app', () => {
    it('handles a GET request to /api', (done) => {
        request(app)
            .get('/api')
            .end((err, response) => {
                assert(response.body.hi === 'there');
                done();
            });
    });

    // it('', () => {
    // });

    // it('', () => {
    // });
    
    // it('', () => {
    // });

});