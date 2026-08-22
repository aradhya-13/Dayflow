const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId:   { type: String, required: true },
    employeeName: { type: String, required: true },
    leaveType:    { type: String, enum: ['sick', 'casual', 'annual'], required: true },
    startDate:    { type: String, required: true },
    endDate:      { type: String, required: true },
    reason:       { type: String, required: true },
    status:       { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote:   { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
