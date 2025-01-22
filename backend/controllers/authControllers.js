const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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

module.exports = { postSignUp };
