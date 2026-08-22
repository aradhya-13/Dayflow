const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
} = require('../controllers/attendanceController');

// Employee
router.post('/checkin',  protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/me',        protect, getMyAttendance);

// Admin
router.get('/',                    protect, requireAdmin, getAllAttendance);
router.get('/:employeeId',         protect, requireAdmin, getAttendanceByEmployee);

module.exports = router;
