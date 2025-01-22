const fs = require('fs');

const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const handleError = require('../util/handleError');

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: 'Successfully received posts',
      posts: posts,
    });
  } catch (error) {
    handleError(error, next);
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
      creator: {
        name: 'Lev',
      },
    });

    res.status(201).json({
      message: 'Successfully created a new post',
      post: post,
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

    if (req.file) {
      await fs.unlink(`./${post.imageUrl}`, (err) => {
        if (err) console.error(err);
        console.log('Deleted image');
      });
    }

    post
      .updateOne({
        title: title,
        content: content,
        imageUrl: imageUrl,
      })
      .then(() => {
        res
          .status(200)
          .json({ message: 'Updated post successfully', post: post });
      })
      .catch(() => {
        const error = new Error('Server side error');
        error.httpStatusCode = 500;
        return next(error);
      });
  } catch (error) {
    handleError(error, next);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Failed to find post with id ' + postId);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: 'Fetched post successfully',
      post: post,
    });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { getPosts, createPost, getPost, updatePost };
