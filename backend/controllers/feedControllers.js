const { validationResult } = require('express-validator');
const Post = require('../models/Post');

const getPosts = async (req, res, next) => {
  const posts = await Post.find();

  try {
    res.status(200).json({
      message: 'Successfully received posts',
      posts: posts,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Failed to create a product due to validation');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const post = await Post.create({
      title: title,
      content: content,
      creator: {
        name: 'Lev',
      },
    });

    res.status(201).json({
      message: 'Successfully created a new post',
      post: post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = { getPosts, createPost };
