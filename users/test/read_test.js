const assert = require('assert');
const User = require('../src/user');

describe('Reading user records', () => {

    let joe;

    beforeEach((done) => {
        alex = new User({ name: 'Alex' });
        joe = new User({ name: 'Joe' });
        maria = new User({ name: 'Maria' });
        zack = new User({ name: 'Zack' });

        Promise.all([alex.save(), joe.save(), maria.save(), zack.save()])
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

    it('can sort, skip and limit result set', (done) => {
        // We have to sort the queried results to get correct items
        // sort({ field: 1 (asc), -1 (desc) })
        User.find({}).sort({ name: 1 }).skip(1).limit(2)
            .then((users) => {
                assert(users.length === 2);
                assert(users[0].name === 'Joe');
                assert(users[1].name === 'Maria');
                done();
            });
    });
});