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
    posts: [PostSchema],        // Example of subdocuments
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'blogPost'
    }]
});

// Specifically use the keyword function when defining a getter rather
// than a fat arrow function. We want 'this' bound to the instance of the model
UserSchema.virtual('postCount').get(function() {
    return this.posts.length;
});

// Apply pre middleware before removing user
// ...again, using keyword function rather than fat arrow due to 'this' binding
UserSchema.pre('remove', function(next) {
    // Use indirect approach to accessing the BlogPost schema
    // ...avoids potential cyclical 'requires' relationship
    const BlogPost = mongoose.model('blogPost');

    // We DO NOT want to iterate through collection of BlogPost ids
    // and issue delete for each...
    // ...instead we pass the collection and process in one call using
    // $in query modifier
    BlogPost.deleteMany({
            _id: { $in: this.blogPosts }
        })
        .then(() => next());    // async middleware function has finished
                                // and the next middleware can be called
});

// 'User' represents the whole collection of Users
const User = mongoose.model('user', UserSchema);

module.exports = User;