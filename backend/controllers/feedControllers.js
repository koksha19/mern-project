const fs = require('fs');

const { validationResult } = require('express-validator');
const io = require('../socket');
const Post = require('../models/Post');
const User = require('../models/User');
const handleError = require('../util/handleError');

const getPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  const userId = req.userId;
  const postPerPage = 2;
  try {
    const totalCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.status(200).json({
      message: 'Successfully received posts',
      posts: posts,
      totalItems: totalCount,
    });
  } catch (error) {
    handleError(error, next);
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, content } = req.body;
  const userId = req.userId;

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Failed to create a product due to validation');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    if (!req.file) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    let imageUrl = req.file.path;
    imageUrl = imageUrl.replace('\\', '/');

    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: userId,
    });

    const user = await User.findById(userId);
    user.posts.push(post);
    await user.save();
    io.getSocket().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });
    res.status(201).json({
      message: 'Successfully created a new post',
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    handleError(error, next);
  }
};

const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Failed to update a product due to validation');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    if (!imageUrl) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('No such post');
      error.statusCode = 404;
      error.data = errors.array();
      return next(error);
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      error.data = errors.array();
      return next(error);
    }

    if (req.file) {
      await fs.unlink(`./${post.imageUrl}`, (err) => {
        if (err) console.error(err);
        console.log('Deleted image');
      });
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const updatedPost = await post.save();

    res.status(200).json({
      message: 'Updated post successfully',
      post: updatedPost,
    });
  } catch (error) {
    handleError(error, next);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Failed to find post with id ' + postId);
      error.statusCode = 404;
      return next(error);
    }
    const creator = await User.findById(userId);
    const name = creator.name;
    res.status(200).json({
      message: 'Fetched post successfully',
      post: post,
      name: name,
    });
  } catch (error) {
    handleError(error, next);
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Failed to delete post with id ' + postId);
      error.statusCode = 404;
      return next(error);
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    await fs.unlink(`./${post.imageUrl}`, (err) => {
      if (err) console.error(err);
      console.log('Deleted image');
    });

    await Post.deleteOne({ _id: postId });
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({ message: 'Deleted post successfully' });
  } catch (error) {
    handleError(error, next);
  }
};

const getStatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('No such user');
      error.statusCode = 404;
      return next(error);
    }

    res
      .status(200)
      .json({ message: 'Fetched status successfully', status: user.status });
  } catch (error) {
    handleError(error, next);
  }
};

const updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  const userId = req.userId;
  const status = req.body.status;

  if (!errors.isEmpty()) {
    const error = new Error('Failed due to validation error');
    error.statusCode = 422;
    return next(error);
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('No such user');
      error.statusCode = 404;
      return next(error);
    }

    user.status = status;
    const updatedUser = await user.save();
    res
      .status(200)
      .json({ message: 'Updated status successfully', user: updatedUser });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getStatus,
  updateStatus,
};
