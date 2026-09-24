const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { protect } = require('../middleware/auth');

// @route   GET /api/community
// @desc    List posts
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (category) {
      query.category = category;
    }
    
    const startIndex = (page - 1) * limit;
    
    const posts = await CommunityPost.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('author', 'name role')
      .populate('comments.author', 'name role');
      
    res.status(200).json({ success: true, data: posts, message: 'Community posts fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/community/:id
// @desc    Get single post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author', 'name role')
      .populate('comments.author', 'name role');
      
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.status(200).json({ success: true, data: post, message: 'Post fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/community
// @desc    Create post
router.post('/', protect, async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    
    const post = await CommunityPost.create(req.body);
    await post.populate('author', 'name role');
    
    res.status(201).json({ success: true, data: post, message: 'Post created successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/community/:id
// @desc    Delete post
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }
    
    await post.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/community/:id/like
// @desc    Toggle like
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(index, 1);
    }
    
    await post.save();
    res.status(200).json({ success: true, data: post, message: 'Post like toggled successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/community/:id/comment
// @desc    Add comment
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    post.comments.push({
      author: req.user.id,
      content
    });
    
    await post.save();
    
    const populatedPost = await CommunityPost.findById(post._id)
      .populate('author', 'name role')
      .populate('comments.author', 'name role');
      
    res.status(201).json({ success: true, data: populatedPost, message: 'Comment added successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/community/:id/comment/:commentId
// @desc    Delete comment
router.delete('/:id/comment/:commentId', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }
    
    comment.deleteOne();
    await post.save();
    
    res.status(200).json({ success: true, data: post, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
