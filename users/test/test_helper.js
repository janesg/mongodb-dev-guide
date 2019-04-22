const mongoose = require('mongoose');

// Get mongoose to use ES6 Promises
mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/users_test', { useNewUrlParser: true })
    .then(() => done())
    .catch((err) => console.warn('Warning', err ));
});

beforeEach((done) => {
    // Mongo names collections using lowercase only
    const { users, blogposts, comments } = mongoose.connection.collections;

    users.drop(() => {
        blogposts.drop(() => {
            comments.drop(() => done());
        });
    });
});

after((done) => {
    mongoose.connection.close(() => done());
});