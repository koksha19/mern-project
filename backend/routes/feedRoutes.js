const express = require('express');

const { body } = require('express-validator');

const feedControllers = require('../controllers/feedControllers');

const router = express.Router();

const postValidation = [
  body('title', 'Title should be at least 5 characters long')
    .trim()
    .isLength({ min: 5 }),
  body('content', 'Content should be at least 5 characters long')
    .trim()
    .isLength({ min: 5 }),
];

router.get('/posts', feedControllers.getPosts);
router.post('/post', postValidation, feedControllers.createPost);
router.get('/post/:postId', feedControllers.getPost);
router.put('/post/:postId', postValidation, feedControllers.updatePost);
router.delete('/post/:postId', feedControllers.deletePost);

module.exports = router;
