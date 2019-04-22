const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
    it('can create a document with a subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ 
                title: 'New Post', 
                content: 'This is the content'
            }]
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 1);
                assert(user.posts[0].title === 'New Post');
                done();
            });
    });

    it('can add subdocuments to existing documents', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: []
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 0);
                user.posts.push({ title: 'New Post' });
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 1);
                assert(user.posts[0].title === 'New Post');
                done();
            });
    });

    it('can remove an existing subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ 
                title: 'New Post', 
                content: 'This is the content'
            }]
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 1);
                user.posts[0].remove();
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts.length === 0);
                done();
            });
    });

});