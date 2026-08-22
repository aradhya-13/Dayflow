const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  updateUserById,
} = require('../controllers/userController');

const router = express.Router();

// All routes below require a valid JWT
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);

// Admin-only routes
router.get('/', requireAdmin, listUsers);
router.get('/:id', requireAdmin, getUserById);
router.put('/:id', requireAdmin, updateUserById);

module.exports = router;
