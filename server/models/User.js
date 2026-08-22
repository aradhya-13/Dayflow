const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    department: { type: String, trim: true, default: '' },
    jobTitle: { type: String, trim: true, default: '' },
    jobRole: {
      type: String,
      enum: [
        '',
        'Software Engineer',
        'Senior Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'DevOps Engineer',
        'Data Analyst',
        'Data Scientist',
        'Product Manager',
        'Project Manager',
        'UI/UX Designer',
        'Graphic Designer',
        'HR Manager',
        'HR Executive',
        'Finance Manager',
        'Accountant',
        'Marketing Manager',
        'Sales Executive',
        'Business Analyst',
        'QA Engineer',
        'Team Lead',
        'Engineering Manager',
        'CTO',
        'CEO',
        'Intern',
        'Other',
      ],
      default: '',
    },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    profilePicture: { type: String, default: '' }, // URL or base64
    salary: { type: Number, default: 0 }, // only exposed to admin
    // Leave balances (reset annually)
    sickLeaveBalance:   { type: Number, default: 6 },
    casualLeaveBalance: { type: Number, default: 6 },
    paidLeaveBalance:   { type: Number, default: 12 },
  },
  { timestamps: true }
);

// Strip passwordHash and salary from default JSON output.
// Salary is re-added by the controller when the requester is admin.
userSchema.methods.toPublicJSON = function (includePrivate = false) {
  const obj = this.toObject();
  delete obj.passwordHash;
  if (!includePrivate) delete obj.salary;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
