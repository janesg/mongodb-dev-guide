const assert = require('assert');

const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middlewares', () => {

    let joe, blogPost;

    beforeEach((done) => {
        joe = new User({ name: 'Joe', blogPosts: [] });
        blogPost = new BlogPost({ 
            title: 'New Blog Post', 
            content: 'Whatever...',
            comments: [] 
        });

        // Mongoose interprets assignment of reference based on object
        joe.blogPosts.push(blogPost);

        // Combine both calls into single returned promise that
        // resolves only when all calls have completed
        Promise.all([joe.save(), blogPost.save()])
            .then(() => done());
    });
    
    it('user cleans up dangling blogposts on delete', (done) => {
        joe.remove()
            .then(() => BlogPost.countDocuments({}))
            .then((count) => {
                assert(count === 0);
                done();
            });
    });
});