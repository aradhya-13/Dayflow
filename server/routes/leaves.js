const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const { applyLeave, getMyLeaves, getMyBalance, getAllLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');

router.post('/',              protect, applyLeave);
router.get('/balance',        protect, getMyBalance);
router.get('/me',             protect, getMyLeaves);
router.get('/',               protect, requireAdmin, getAllLeaves);
router.put('/:id/approve',    protect, requireAdmin, approveLeave);
router.put('/:id/reject',     protect, requireAdmin, rejectLeave);

module.exports = router;
