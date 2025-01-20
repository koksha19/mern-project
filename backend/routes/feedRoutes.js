const express = require('express');

const feedControllers = require('../controllers/feedControllers');

const router = express.Router();

router.get('/posts', feedControllers.getPosts);
router.post('/', feedControllers.createPost);

module.exports = router;
