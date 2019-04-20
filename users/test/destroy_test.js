const assert = require('assert');
const User = require('../src/user');

describe('Deleting user records', () => {

    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        joe.save()
            .then(() => done());
    });

    it('model instance remove', (done) => {
        // First, confirm user exists
        User.findOne({ name: 'Joe' })
            .then((user) => assert(user !== null));

        // Remove the user and attempt to find again
        //  - uses chained promises
        joe.remove()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user === null);
                done();
            });
    });

    it('class method deleteOne', (done) => {
        User.deleteOne({ name: 'Joe' })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user === null);
                done();
            });
    });

    it('class method deleteMany', (done) => {
        User.deleteMany({ name: 'Joe' })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user === null);
                done();
            });
    });

    it('class method findOneAndDelete', (done) => {
        User.findOneAndDelete({ name: 'Joe' })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user === null);
                done();
            });
    });

    it('class method findByIdAndDelete', (done) => {
        User.findByIdAndDelete(joe.id)
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user === null);
                done();
            });
    });

});