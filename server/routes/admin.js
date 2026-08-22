const express = require('express');
const router  = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const { getStats, getAnalytics } = require('../controllers/adminController');

router.get('/stats',     protect, requireAdmin, getStats);
router.get('/analytics', protect, requireAdmin, getAnalytics);

module.exports = router;
