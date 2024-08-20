// Existing imports and middleware
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const Post = require('./models/post'); // Import model Post

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);  // Use express-ejs-layouts

// Set view engine
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Existing Routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from MongoDB
        res.render('index', { posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Server Error');
    }
});

app.get('/new-post', (req, res) => {
    res.render('new-post');
});

app.post('/new-post', async (req, res) => {
    try {
        const { title, content } = req.body; // Assume content is HTML
        const newPost = new Post({
            title,
            content // Save content as HTML
        });
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving post:', err);
        res.status(500).send('Server Error');
    }
});

// Admin Routes
// Admin Dashboard
app.get('/admin', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from MongoDB
        res.render('admin/index', { posts });
    } catch (err) {
        console.error('Error fetching posts for admin:', err);
        res.status(500).send('Server Error');
    }
});

// Edit Post Form
app.get('/admin/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('admin/edit', { post });
    } catch (err) {
        console.error('Error fetching post for editing:', err);
        res.status(500).send('Server Error');
    }
});

// Update Post
app.post('/admin/edit/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        await Post.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect('/admin');
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).send('Server Error');
    }
});

// Delete Post
app.get('/admin/delete/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send('Server Error');
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
