const { validationResult } = require('express-validator');

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

const createPost = (req, res) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Failed to create a product',
      errors: errors.array(),
    });
  }

  res.status(201).json({
    message: 'Successfully created a new post',
    post: {
      _id: new Date(),
      title: title,
      content: content,
      creator: {
        name: 'Lev',
      },
      createdAt: Date.now(),
    },
  });
};

module.exports = { getPosts, createPost };
