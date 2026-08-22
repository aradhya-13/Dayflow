const User = require('../models/User');

// GET /api/users/me  — own profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: user.toPublicJSON(req.user.role === 'admin') });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/users/me  — employee edits own limited fields; admin edits all
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isAdmin = req.user.role === 'admin';

    // Fields any user can update on their own profile
    const allowedEmployee = ['phone', 'address', 'profilePicture', 'jobRole', 'department', 'jobTitle'];
    // Additional fields only admin can update on their own record
    const allowedAdmin = [...allowedEmployee, 'name', 'department', 'jobTitle', 'jobRole', 'salary', 'role', 'employeeId'];

    const permitted = isAdmin ? allowedAdmin : allowedEmployee;
    permitted.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();
    return res.json({ success: true, message: 'Profile updated', data: user.toPublicJSON(isAdmin) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/users  — admin: list all employees
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/users/:id  — admin: view any employee
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user.toPublicJSON(true) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/users/:id  — admin: edit any employee
const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const editable = ['name', 'phone', 'address', 'profilePicture', 'department', 'jobTitle', 'jobRole', 'salary', 'role'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();
    return res.json({ success: true, message: 'Employee updated', data: user.toPublicJSON(true) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMe, updateMe, listUsers, getUserById, updateUserById };
