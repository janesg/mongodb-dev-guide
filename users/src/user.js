const mongoose = require('mongoose');
const PostSchema = require('./post')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] ,
        validate: {
            validator: (name) => name.length >= 3,
            message: 'Name must be at least 3 characters'
        }
    },
    likes: Number,
    posts: [PostSchema]
});

// Specifically use the keyword function when defining a getter rather
// than a fat arrow function. We want 'this' bound to the instance of the model
UserSchema.virtual('postCount').get(function() {
    return this.posts.length;
});

// 'User' represents the whole collection of Users
const User = mongoose.model('user', UserSchema);

module.exports = User;