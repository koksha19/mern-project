const express = require('express');

const { body } = require('express-validator');

const feedControllers = require('../controllers/feedControllers');

const router = express.Router();

router.get('/posts', feedControllers.getPosts);
router.post(
  '/post',
  [
    body('title', 'Title should be at least 5 characters long')
      .trim()
      .isLength({ min: 5 }),
    body('content', 'Content should be at least 5 characters long')
      .trim()
      .isLength({ min: 5 }),
  ],
  feedControllers.createPost
);
router.get('/post/:postId', feedControllers.getPost);

module.exports = router;
