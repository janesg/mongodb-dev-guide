const mongoose = require('mongoose');

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
    postCount: Number
});

// 'User' represents the whole collection of Users
const User = mongoose.model('user', UserSchema);

module.exports = User;