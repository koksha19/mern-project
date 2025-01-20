const { validationResult } = require('express-validator');
const Post = require('../models/Post');

const getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        title: 'Post 1',
        content: 'Content',
        imageUrl: '/images/needful-things.png',
        creator: {
          name: 'Lev',
        },
        createdAt: Date.now(),
      },
    ],
  });
};

const createPost = async (req, res) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Failed to create a product due to validation',
      errors: errors.array(),
    });
  }

  try {
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
    res
      .status(500)
      .json({ message: 'Failed to create a product', error: error });
  }
};

module.exports = { getPosts, createPost };
