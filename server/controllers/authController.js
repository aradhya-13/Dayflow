const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, employeeId: user.employeeId },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { employeeId, name, email, password, role } = req.body;

    if (!employeeId || !name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email or Employee ID already registered' });
    }

    const allowedRoles = ['admin', 'employee'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ employeeId, name, email, passwordHash, role });

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      message: 'Account created',
      data: { token, user: user.toPublicJSON(role === 'admin') },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/signin
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user);
    return res.status(200).json({
      success: true,
      message: 'Signed in',
      data: { token, user: user.toPublicJSON(user.role === 'admin') },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { signup, signin };
