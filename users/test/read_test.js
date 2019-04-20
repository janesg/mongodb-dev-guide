const assert = require('assert');
const User = require('../src/user');

describe('Reading user records', () => {

    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        joe.save()
            .then(() => done());
    });

    it('finds all users by name', (done) => {
        User.find({ name: 'Joe' })
            .then((users) => {
                assert(users.length === 1);
                // Because _id is an Object that wraps the value
                assert(users[0]._id.toString() === joe._id.toString());
                // ...but ._id.toString() is same as .id
                assert(joe.id === joe._id.toString());
                assert(users[0].id === joe.id);
                done();
            }); 
    });

    it('find specific user by id', (done) => {
        User.findOne({ _id: joe.id })
            .then((user) => {
                assert(user.id === joe._id.toString());
                assert(user.name === 'Joe');
                done();
            }); 
    });
});