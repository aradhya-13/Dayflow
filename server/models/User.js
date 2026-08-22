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
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    profilePicture: { type: String, default: '' }, // URL or base64
    salary: { type: Number, default: 0 }, // only exposed to admin
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
