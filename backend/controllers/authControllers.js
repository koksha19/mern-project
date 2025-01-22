const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const handleError = require('../util/handleError');
const User = require('../models/User');

const postSignUp = async (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Failed to sign up due to validation');
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res
      .status(201)
      .json({ message: 'Created user successfully', userId: user._id });
  } catch (error) {
    handleError(error, next);
  }
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      const error = new Error('No user with such email found');
      error.statusCode = 403;
      return next(error);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Password is incorrect');
      error.statusCode = 403;
      return next(error);
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'secret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = { postSignUp, postLogin };
