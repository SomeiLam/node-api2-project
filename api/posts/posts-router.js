const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find()
        .then(found => {
            res.status(200).json(found);
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack,
            });
        });
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved",
                err: err.message,
                stack: err.stack,
            });
        });
});

router.post('/', (req, res) => {
    const { contents, title } = req.body;
    if (!contents || !title) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        });
    } else {
        Post.insert(req.body)
            .then(({ id }) => {
                return Post.findById(id);
            })
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack,
                });
            });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            if (!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message: "Please provide title and contents for the post"
                })
            } else {
                await Post.update(id, req.body)
                const updatedPost = await Post.findById(id)
                res.status(200).json(updatedPost)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be modified",
            err: err.message,
            stack: err.stack,
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack,
        })
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const comments = await Post.findPostComments(id)
            res.status(200).json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
});

module.exports = router;
