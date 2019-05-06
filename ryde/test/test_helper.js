const mongoose = require('mongoose');

before(done => {
    // Note: we are connecting to a separate test database
    mongoose.connect('mongodb://localhost/ryde_test', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true 
    });

    mongoose.connection
        .once('open', () => done())
        .on('error', err => console.warning('Warning', error));
});

beforeEach(done => {
    const { drivers } = mongoose.connection.collections;

    // Add a catch statement to handle case where 
    // we don't have an existing drivers collection
    //  - make sure we still have the geometry index available
    //    even when the collection is empty
    drivers.drop()
        .then(() => drivers.createIndex({
            'geometry.coordinates': '2dsphere'
        }))
        .then(() => done())
        .catch(() => done());
})