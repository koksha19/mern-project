const express = require('express');

const { body } = require('express-validator');

const feedControllers = require('../controllers/feedControllers');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

const postValidation = [
  body('title', 'Title should be at least 5 characters long')
    .trim()
    .isLength({ min: 5 }),
  body('content', 'Content should be at least 5 characters long')
    .trim()
    .isLength({ min: 5 }),
];

router.get('/posts', isAuth, feedControllers.getPosts);
router.post('/post', postValidation, isAuth, feedControllers.createPost);
router.get('/post/:postId', isAuth, feedControllers.getPost);
router.put('/post/:postId', postValidation, isAuth, feedControllers.updatePost);
router.delete('/post/:postId', isAuth, feedControllers.deletePost);

module.exports = router;
