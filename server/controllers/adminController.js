const User       = require('../models/User');
const Leave      = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Payroll    = require('../models/Payroll');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [totalEmployees, pendingLeaves, presentToday, absentToday] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      Leave.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({ date: today, status: 'present' }),
      Attendance.countDocuments({ date: today, status: 'absent' }),
    ]);
    return res.json({ success: true, data: { totalEmployees, pendingLeaves, presentToday, absentToday } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const now   = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();

    // 1. Leaves by department (approved leaves joined with user department)
    const approvedLeaves = await Leave.find({ status: 'approved' });
    const userIds = [...new Set(approvedLeaves.map(l => l.userId?.toString()).filter(Boolean))];
    const users   = await User.find({ _id: { $in: userIds } }).select('_id department');
    const deptMap = Object.fromEntries(users.map(u => [u._id.toString(), u.department || 'Unknown']));
    const leaveDeptCount = {};
    approvedLeaves.forEach(l => {
      const dept = deptMap[l.userId?.toString()] || 'Unknown';
      leaveDeptCount[dept] = (leaveDeptCount[dept] || 0) + 1;
    });
    const leavesByDepartment = Object.entries(leaveDeptCount).map(([department, count]) => ({ department, count }));

    // 2. Attendance trend last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const attendanceRecords = await Attendance.find({ date: { $in: days } });
    const attendanceTrend = days.map(date => ({
      date,
      presentCount: attendanceRecords.filter(r => r.date === date && r.status === 'present').length,
      absentCount:  attendanceRecords.filter(r => r.date === date && r.status === 'absent').length,
    }));

    // 3. Payroll by department for current month
    const payslips = await Payroll.find({ month, year });
    const payrollUserIds = [...new Set(payslips.map(p => p.userId?.toString()).filter(Boolean))];
    const payrollUsers   = await User.find({ _id: { $in: payrollUserIds } }).select('_id department');
    const payrollDeptMap = Object.fromEntries(payrollUsers.map(u => [u._id.toString(), u.department || 'Unknown']));
    const deptSalary = {};
    payslips.forEach(p => {
      const dept = payrollDeptMap[p.userId?.toString()] || 'Unknown';
      deptSalary[dept] = (deptSalary[dept] || 0) + (p.netSalary || 0);
    });
    const payrollByDepartment = Object.entries(deptSalary).map(([department, totalNetSalary]) => ({ department, totalNetSalary }));

    return res.json({ success: true, data: { leavesByDepartment, attendanceTrend, payrollByDepartment } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getStats, getAnalytics };
