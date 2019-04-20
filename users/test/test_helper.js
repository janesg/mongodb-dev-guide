const mongoose = require('mongoose');

// Get mongoose to use ES6 Promises
mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/users_test', { useNewUrlParser: true })
    .then(() => done())
    .catch((err) => console.warn('Warning', err ));
});

beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => done());
});

after((done) => {
    mongoose.connection.close(() => done());
});