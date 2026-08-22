const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: { type: String, required: true, trim: true },
    employeeName: { type: String, required: true, trim: true },
    // 'YYYY-MM-DD' — keeps timezone-safe day comparisons simple
    date: { type: String, required: true },
    checkIn:  { type: String, default: '' }, // 'HH:MM'
    checkOut: { type: String, default: '' }, // 'HH:MM'
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
    hoursWorked: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One record per employee per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
