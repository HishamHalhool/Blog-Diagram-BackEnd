const Post = require('../models/Post');

// Helper to get next numeric post id
async function getNextPostId() {
  const lastPost = await Post.findOne().sort({ id: -1 });
  return lastPost ? lastPost.id + 1 : 1;
}

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const id = await getNextPostId();
    const post = new Post({
      id,
      title,
      description,
      url,
      createdBy: req.user.name,
      userId: req.user.id
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { title, description, url } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (url) post.url = url;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 