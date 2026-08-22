const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId:   { type: String, required: true },
    employeeName: { type: String, required: true },
    month:        { type: Number, required: true, min: 1, max: 12 },
    year:         { type: Number, required: true },
    basicSalary:  { type: Number, required: true },
    deductions:   { type: Number, default: 0 },
    bonuses:      { type: Number, default: 0 },
    netSalary:    { type: Number, required: true },
    status:       { type: String, enum: ['draft', 'issued'], default: 'draft' },
    issuedAt:     { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payroll', payrollSchema);
