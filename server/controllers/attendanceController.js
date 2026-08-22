const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper: get today's date as 'YYYY-MM-DD' in local time
const today = () => new Date().toISOString().slice(0, 10);

// Helper: convert 'HH:MM' to total minutes
const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// POST /api/attendance/checkin  — employee checks in
const checkIn = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const date = today();
    const existing = await Attendance.findOne({ userId: req.user.id, date });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already checked in today' });
    }

    // Determine status: after 09:00 = late
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const status = toMinutes(checkInTime) > toMinutes('09:00') ? 'late' : 'present';

    const record = await Attendance.create({
      userId: user._id,
      employeeId: user.employeeId,
      employeeName: user.name,
      date,
      checkIn: checkInTime,
      status,
    });

    return res.status(201).json({ success: true, message: 'Checked in', data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/attendance/checkout  — employee checks out
const checkOut = async (req, res) => {
  try {
    const date = today();
    const record = await Attendance.findOne({ userId: req.user.id, date });

    if (!record) {
      return res.status(404).json({ success: false, message: 'No check-in found for today' });
    }
    if (record.checkOut) {
      return res.status(409).json({ success: false, message: 'Already checked out today' });
    }

    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const hoursWorked = parseFloat(
      ((toMinutes(checkOutTime) - toMinutes(record.checkIn)) / 60).toFixed(2)
    );

    record.checkOut = checkOutTime;
    record.hoursWorked = hoursWorked > 0 ? hoursWorked : 0;
    await record.save();

    return res.json({ success: true, message: 'Checked out', data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/attendance/me  — own history
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json({ success: true, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/attendance  — admin: all records
const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    return res.json({ success: true, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/attendance/:employeeId  — admin: one employee's records
const getAttendanceByEmployee = async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.employeeId }).sort({ date: -1 });
    return res.json({ success: true, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance, getAttendanceByEmployee };
