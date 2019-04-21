const assert = require('assert');
const User = require('../src/user');

describe('Updating user records', () => {

    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe', postCount: 5 });
        joe.save()
            .then(() => done());
    });

    const assertName = (operation, done) => {
        operation
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Alex');
                done();
            });
    }

    it('model instance update using set and save', (done) => {
        // First, confirm user exists
        User.findOne({ name: 'Joe' })
            .then((user) => assert(user !== null));

        // Set property of instance in memory only
        joe.set('name', 'Alex');

        // Persist changes to database
        assertName(joe.save(), done);
    });

    it('model instance update using updateOne', (done) => {
        assertName(joe.updateOne({ name: 'Alex' }), done);
    });

    it('model class update using updateOne', (done) => {
        assertName(User.updateOne({ _id: joe.id }, { name: 'Alex' }), done);
    });

    it('model class update using updateMany', (done) => {
        assertName(User.updateMany({ name: 'Joe' }, { name: 'Alex' }), done);
    });

    it('all users can have their post count incremented', (done) => {
        User.updateMany({}, { $inc: { postCount: 3 }})
            .then(() => User.find({}))
            .then((users) => {
                assert(users.length === 1);
                assert(users[0].name === 'Joe');
                assert(users[0].postCount === 8);
                done();
            });        
    });

});