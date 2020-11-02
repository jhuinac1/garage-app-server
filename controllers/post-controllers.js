const express = require('express');
const Post = require('../models/post-schema');
const postRouter = express.Router();


postRouter.get("/byName/:cityName", (req, res) => {
    Post.find({ city: req.params.cityName }, (error, data) => {
        res.json(data);
    });
});

postRouter.delete("/deletePost/:id", (req, res) => {
    Post.findByIdAndDelete(req.params.id, (error, data) => {
        Post.find({ uId: data.uId }, (error, data) => {
            res.json(data);
        }
        )
    });
}
)

postRouter.get("/userPosts/:id", (req, res) => {
    Post.find({ uId: req.params.id }, (error, data) => {
        res.json(data);
    });
});

postRouter.get("/:id", (req, res) => {
    Post.findById(req.params.id, (error, data) => {
        res.json(data);
    });
});

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