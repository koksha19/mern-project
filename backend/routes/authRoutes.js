const express = require('express');
const { body } = require('express-validator');

const User = require('../models/User');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email is required')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('User with such email already exists');
          }
        });
      }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().isLength({ min: 3 }),
  ],
  authControllers.postSignUp
);

module.exports = router;
