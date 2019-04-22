const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const Comment = require('../src/comment');

describe('Associations', () => {

    let joe, blogPost, comment;

    beforeEach((done) => {
        joe = new User({ name: 'Joe', blogPosts: [] });
        blogPost = new BlogPost({ 
            title: 'New Blog Post', 
            content: 'Whatever...',
            comments: [] 
        });
        comment = new Comment({ content: 'Whoa...a comment' });

        // Mongoose interprets assignment of reference based on object
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.author = joe;

        // Combine all 3 calls into single returned promise that
        // resolves only when all 3 calls have completed
        Promise.all([joe.save(), blogPost.save(), comment.save()])
            .then(() => done());
    });
    
    // Use it.only to get mocha to only run that single test
    it('saves relation between blog post and user', (done) => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts')      // Query modifier to load association
            .then((user) => {
                assert(user.blogPosts.length === 1);
                assert(user.blogPosts[0].title === 'New Blog Post');
                done();
            });
    });

    it('saves a full relation graph - user/blog post/comment', (done) => {
        User.findOne({ name: 'Joe' })
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'author',
                        populate: 'user'
                    }
                }
            })      
            .then((user) => {
                assert(user.name === 'Joe');
                assert(user.blogPosts.length === 1);
                assert(user.blogPosts[0].title === 'New Blog Post');
                assert(user.blogPosts[0].comments.length === 1);
                assert(user.blogPosts[0].comments[0].content === 'Whoa...a comment');
                assert(user.blogPosts[0].comments[0].author.name === 'Joe');
                done();
            });
    });

});