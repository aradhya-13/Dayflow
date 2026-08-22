const Leave = require('../models/Leave');
const User  = require('../models/User');

const daysBetween = (a, b) =>
  Math.max(1, Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)) + 1);

const balanceField = { sick: 'sickLeaveBalance', casual: 'casualLeaveBalance', annual: 'paidLeaveBalance' };

// POST /api/leaves
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const user = await User.findById(req.user.id);
    const leave = await Leave.create({
      userId: req.user.id,
      employeeId: user.employeeId,
      employeeName: user.name,
      leaveType, startDate, endDate, reason,
    });

    return res.status(201).json({ success: true, message: 'Leave request submitted', data: leave });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leaves/me
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: leaves });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leaves/balance
const getMyBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({
      success: true,
      data: {
        sick:   { used: 6  - user.sickLeaveBalance,   remaining: user.sickLeaveBalance,   total: 6  },
        casual: { used: 6  - user.casualLeaveBalance,  remaining: user.casualLeaveBalance,  total: 6  },
        annual: { used: 12 - user.paidLeaveBalance,    remaining: user.paidLeaveBalance,    total: 12 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leaves
const getAllLeaves = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: leaves });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/leaves/:id/approve  — deducts balance
const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });

    const days  = daysBetween(leave.startDate, leave.endDate);
    const field = balanceField[leave.leaveType];
    const user  = await User.findById(leave.userId);

    if (field && user[field] < days)
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leave.leaveType} leave balance. Available: ${user[field]} day(s), requested: ${days} day(s).`,
      });

    // Deduct balance
    if (field) user[field] -= days;
    await user.save();

    leave.status     = 'approved';
    leave.reviewedBy = req.user.id;
    leave.reviewNote = '';
    await leave.save();

    return res.json({ success: true, message: 'Leave approved', data: leave });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/leaves/:id/reject
const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedBy: req.user.id, reviewNote: req.body.reviewNote || '' },
      { new: true }
    );
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    return res.json({ success: true, message: 'Leave rejected', data: leave });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { applyLeave, getMyLeaves, getMyBalance, getAllLeaves, approveLeave, rejectLeave };
