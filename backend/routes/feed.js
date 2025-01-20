const express = require('express');

const feedControllers = require('../controllers/feedControllers');

const router = express.Router();

router.get('/', feedControllers.getPosts);
router.post('/', feedControllers.createPost);

module.exports = router;
