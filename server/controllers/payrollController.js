const Payroll = require('../models/Payroll');
const User    = require('../models/User');

// POST /api/payroll/generate — admin generates payslip
const generatePayslip = async (req, res) => {
  try {
    const { userId, month, year, deductions = 0, bonusPercent = 0 } = req.body;
    if (!userId || !month || !year)
      return res.status(400).json({ success: false, message: 'userId, month and year are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Prevent duplicate payslip for same month/year
    const exists = await Payroll.findOne({ userId, month, year });
    if (exists)
      return res.status(409).json({ success: false, message: 'Payslip already exists for this month' });

    const basicSalary = user.salary || 0;
    const bonuses     = Math.round((basicSalary * Number(bonusPercent)) / 100);
    const netSalary   = basicSalary + bonuses - Number(deductions);

    const payslip = await Payroll.create({
      userId,
      employeeId:   user.employeeId,
      employeeName: user.name,
      month:  Number(month),
      year:   Number(year),
      basicSalary,
      deductions: Number(deductions),
      bonuses:    Number(bonuses),
      netSalary,
    });

    return res.status(201).json({ success: true, message: 'Payslip generated', data: payslip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/payroll/me — employee views own payslips
const getMyPayslips = async (req, res) => {
  try {
    const payslips = await Payroll.find({ userId: req.user.id }).sort({ year: -1, month: -1 });
    return res.json({ success: true, data: payslips });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/payroll — admin views all
const getAllPayslips = async (req, res) => {
  try {
    const payslips = await Payroll.find().sort({ year: -1, month: -1 });
    return res.json({ success: true, data: payslips });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/payroll/:id/issue — admin marks as issued
const issuePayslip = async (req, res) => {
  try {
    const payslip = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: 'issued', issuedAt: new Date() },
      { new: true }
    );
    if (!payslip) return res.status(404).json({ success: false, message: 'Payslip not found' });
    return res.json({ success: true, message: 'Payslip issued', data: payslip });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { generatePayslip, getMyPayslips, getAllPayslips, issuePayslip };
