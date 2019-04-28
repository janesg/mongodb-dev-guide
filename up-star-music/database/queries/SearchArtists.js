const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */

const buildQuery = (criteria) => {
    // Looks like all the different criteria are 
    // 'AND'-ed together by default
    const query = {};

    // Had to add a text index on artist.name using RoboMongo
    // Name: name_idx (actual value not relevant)
    // Keys: {
    //          "name" : "text"
    //       }
    if (criteria.name) {
        query.$text = { $search: criteria.name }
    }

    if (criteria.age) {
        query.age = {
            $gte: criteria.age.min,
            $lte: criteria.age.max
        }
    }

    if (criteria.yearsActive) {
        query.yearsActive = {
            $gte: criteria.yearsActive.min,
            $lte: criteria.yearsActive.max
        }
    }

    return query;
};

module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
    const queryCriteria = buildQuery(criteria);

    const findQuery = Artist.find(queryCriteria)
        .sort({ [sortProperty]: 1 })    // ES6 interpolated key
        .skip(offset)
        .limit(limit);

    // Can't use countDocuments as we're using Mongoose 4.4.6
    // which only supports MongoDB 3.2.x
    // Function countDocuments introduced in MongoDB 4.0.3
    // const countQuery = Artist.countDocuments({});
    const countQuery = Artist.count(queryCriteria);

    return Promise.all([findQuery, countQuery])
        .then(results => ({
            all: results[0],
            count: results[1],
            offset: offset,
            limit: limit
        }));
};
