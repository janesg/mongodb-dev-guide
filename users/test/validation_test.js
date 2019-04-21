const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
    it('requires a user name', () => {
        const user = new User({ name: undefined });
        // Invoke synchronous validation process
        const result = user.validateSync();
        const { message } = result.errors.name; // ES6 destructuring
        assert(message === 'Name is required');
    });

    it('requires a user name - async', (done) => {
        const user = new User({ name: undefined });
        // Invoke asyncronous validation with callback
        user.validate((result) => {
            const { message } = result.errors.name; // ES6 destructuring
            assert(message === 'Name is required');
            done();
        });        
    });

    it('requires user name at least 3 characters long', () => {
        const user = new User({ name: 'Al' });
        const result = user.validateSync();
        const { message } = result.errors.name; // ES6 destructuring
        assert(message === 'Name must be at least 3 characters');
    });

    it('disallow saving of invalid record', (done) => {
        const user = new User({ name: 'Al' });

        user.save()
            .catch((result) => {
                const { message } = result.errors.name; // ES6 destructuring
                assert(message === 'Name must be at least 3 characters');
                done();
            });
    });
});
