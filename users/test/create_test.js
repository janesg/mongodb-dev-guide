const assert = require('assert');
const User = require('../src/user');

describe('Creating user records', () => {
    it('saves a user', (done) => {
        const joe = new User({ name: 'Joe' });
        assert(joe.isNew);
        
        joe.save()
            .then(() => {
                // Once persisted, the isNew flag becomes false
                assert(!joe.isNew);
                done();
            });
    });
});


