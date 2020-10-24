const express = require('express');
const Post = require('../models/post-schema');
const postRouter = express.Router();



postRouter.get("/", (req, res) => {
    Post.find({}, (error, data) => {
        res.json(data);
    });
});

postRouter.post("/", (req, res) => {
    Post.create(req.body, (error, newPost) => {
        res.json(newPost);
    });
});

module.exports = postRouter;