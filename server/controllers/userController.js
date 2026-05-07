const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Generate JWT
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register User
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1) Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 2) Create user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role.toLowerCase(),
    });

    // 3) Send response
    const token = signToken(newUser._id);
    
    // Hide password from output
    newUser.passwordHash = undefined;

    res.status(201).json({
      status: 'success',
      token,
      user: newUser
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
};

/**
 * Login User
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    // 3) If everything ok, send token
    const token = signToken(user._id);
    user.passwordHash = undefined;

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get Me (Current User)
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user
  });
};
