const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    location: { type: String },
}, {
    timestamps: true,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;