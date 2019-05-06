const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/routes');
const app = express();

// Connect to the Mongo DB
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/ryde', { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true 
    });
}

// Wire up the 'pre' middlewares before routes
//  - run in the order of registration before the request handlers
app.use(bodyParser.json());

// Bring in the defined routes...
routes(app);

// Wire up the 'post' middlewares after routes
//  - specifically...this is our error handler
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
});

module.exports = app;