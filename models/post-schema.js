const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    pictures: [String],
    city: { type: String, required: true },
    contactInfo: { type: String, required: true },
    uId: { type: String, required: true }
}, {
    timestamps: true,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;