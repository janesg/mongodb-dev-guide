const assert = require('assert');
const request = require('supertest');

const app = require('../../src/app');
const Driver = require('../../src/models/driver');

describe('Drivers controller', () => {
    it('POST to /api/drivers creates a new driver', (done) => {
        Driver.countDocuments({})
            .then(count => {
                request(app)
                .post('/api/drivers')
                .send({                     // Specify the body to send in request
                    email: 'test@test.com'
                })
                .end((err, response) => {
                    Driver.countDocuments({})
                        .then(newCount => {
                            assert(newCount === count + 1);
                            done();
                        });
                });    
            });
    });

    it('PUT to /api/drivers/:id updates an existing driver', (done) => {
        const driver = new Driver({
            email: 'test@test.com',
            driving: false
        });

        driver.save()
            .then(() => {
                request(app)
                    .put(`/api/drivers/${driver._id}`)
                    .send({ driving: true })
                    .end(() => {
                        Driver.findOne({ _id: driver._id })
                            .then(d => {
                                assert(d.driving === true);
                                done();
                            });
                    });
            });
    });

    it('DELETE to /api/drivers/:id deletes an existing driver', (done) => {
        const driver = new Driver({
            email: 'test@test.com',
            driving: false
        });

        driver.save()
            .then(() => {
                request(app)
                    .delete(`/api/drivers/${driver._id}`)
                    .end(() => {
                        Driver.findOne({ _id: driver._id })
                            .then(d => {
                                assert(d === null);
                                done();
                            });
                    });
            });
    });
    
    it('GET to /api/drivers finds drivers for a location', (done) => {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: {
                type: 'Point', coordinates: [-122.4759902, 47.6147628]
            }
        });

        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: {
                type: 'Point', coordinates: [-80.253, 25.791]
            }
        });

        Promise.all([seattleDriver.save(), miamiDriver.save()])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80.25&lat=25.75')
                    .end((err, response) => {
                        // console.log(response.body);
                        assert(response.body.length === 1);
                        assert(response.body[0].email === 'miami@test.com');
                        done();
                    });
            });
    });

});