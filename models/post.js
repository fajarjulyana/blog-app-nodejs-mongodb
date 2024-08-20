const mongoose = require('mongoose');

// Define schema
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true } // Content as HTML
});

// Create model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
