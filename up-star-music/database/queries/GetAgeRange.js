const Artist = require('../models/artist');

/**
 * Finds the lowest and highest age of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max ages, like { min: 16, max: 45 }.
 */
module.exports = () => {
    // Never want to query all records
    // ...very wasteful if only extracting info from 2 records when
    // result set could potentially be very large
    // Instead, use limit so that only 1 is returned each time
    const minAgeQuery = Artist.find({}).sort({ age: 1 }).limit(1)
        .then(artists => artists[0].age);

    const maxAgeQuery = Artist.find({}).sort({ age: -1 }).limit(1)
        .then(artists => artists[0].age);

    return Promise.all([minAgeQuery, maxAgeQuery])
        // Need to wrap the object literal with parenthesis
        .then(results => ({ min: results[0], max: results[1] }));
};
