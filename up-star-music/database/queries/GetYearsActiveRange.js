const Artist = require('../models/artist');

/**
 * Finds the lowest and highest yearsActive of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max yearsActive, like { min: 0, max: 14 }.
 */
module.exports = () => {
    const minYearsQuery = Artist.find({}).sort({ yearsActive: 1 }).limit(1)
        .then(artists => artists[0].yearsActive);

    const maxYearsQuery = Artist.find({}).sort({ yearsActive: -1 }).limit(1)
        .then(artists => artists[0].yearsActive);

    return Promise.all([minYearsQuery, maxYearsQuery])
        // Need to wrap the object literal with parenthesis
        .then(results => ({ min: results[0], max: results[1] }));
};
