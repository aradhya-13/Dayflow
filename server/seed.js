require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const users = [
  // 3 Admins
  {
    employeeId: 'ADM001',
    name: 'Shubham Tasagave',
    email: 'shubhamdtasagave@gmail.com',
    password: 'Admin@1234',
    role: 'admin',
    department: 'Human Resources',
    jobTitle: 'HR Director',
    phone: '+91 98765 43210',
    address: '12, MG Road, Pune, Maharashtra',
    salary: 120000,
  },
  {
    employeeId: 'ADM002',
    name: 'Asha ',
    email: 'Asha@gmail.com',
    password: 'Admin@1234',
    role: 'admin',
    department: 'Human Resources',
    jobTitle: 'HR Manager',
    phone: '+91 91234 56789',
    address: '45, Koregaon Park, Pune, Maharashtra',
    salary: 105000,
  },
  {
    employeeId: 'ADM003',
    name: 'Aradhya pandey',
    email: 'aradhya@gmail.com',
    password: 'Admin@1234',
    role: 'admin',
    department: 'Operations',
    jobTitle: 'Operations Head',
    phone: '+91 99887 76655',
    address: '7, Baner Road, Pune, Maharashtra',
    salary: 115000,
  },

  // 20 Employees
  {
    employeeId: 'EMP001',
    name: 'Priya Mehta',
    email: 'priya@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Frontend Developer',
    phone: '+91 91234 11111',
    address: '22, Aundh, Pune',
    salary: 72000,
  },
  {
    employeeId: 'EMP002',
    name: 'Arjun Patil',
    email: 'arjun@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Backend Developer',
    phone: '+91 90000 22222',
    address: '8, Hadapsar, Pune',
    salary: 78000,
  },
  {
    employeeId: 'EMP003',
    name: 'Sneha Kulkarni',
    email: 'sneha@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Design',
    jobTitle: 'UI/UX Designer',
    phone: '+91 88888 33333',
    address: '5, Viman Nagar, Pune',
    salary: 65000,
  },
  {
    employeeId: 'EMP004',
    name: 'Vikram Joshi',
    email: 'vikram@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Sales',
    jobTitle: 'Sales Executive',
    phone: '+91 77777 44444',
    address: '3, Kothrud, Pune',
    salary: 55000,
  },
  {
    employeeId: 'EMP005',
    name: 'Anjali Desai',
    email: 'anjali@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Finance',
    jobTitle: 'Finance Analyst',
    phone: '+91 99999 55555',
    address: '67, Shivajinagar, Pune',
    salary: 68000,
  },
  {
    employeeId: 'EMP006',
    name: 'Rohan Verma',
    email: 'rohan@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'DevOps Engineer',
    phone: '+91 86868 66666',
    address: '11, Wakad, Pune',
    salary: 82000,
  },
  {
    employeeId: 'EMP007',
    name: 'Neha Gupta',
    email: 'neha@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Marketing',
    jobTitle: 'Marketing Executive',
    phone: '+91 81818 77777',
    address: '9, Pimpri, Pune',
    salary: 52000,
  },
  {
    employeeId: 'EMP008',
    name: 'Kiran More',
    email: 'kiran@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Full Stack Developer',
    phone: '+91 87654 88888',
    address: '14, Hinjewadi, Pune',
    salary: 88000,
  },
  {
    employeeId: 'EMP009',
    name: 'Pooja Nair',
    email: 'pooja@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'HR',
    jobTitle: 'HR Executive',
    phone: '+91 93456 99999',
    address: '2, Kalyani Nagar, Pune',
    salary: 48000,
  },
  {
    employeeId: 'EMP010',
    name: 'Amit Sawant',
    email: 'amit@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Finance',
    jobTitle: 'Senior Accountant',
    phone: '+91 98123 10101',
    address: '33, Camp, Pune',
    salary: 74000,
  },
  {
    employeeId: 'EMP011',
    name: 'Deepika Rao',
    email: 'deepika@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Design',
    jobTitle: 'Graphic Designer',
    phone: '+91 92345 11100',
    address: '17, Magarpatta, Pune',
    salary: 58000,
  },
  {
    employeeId: 'EMP012',
    name: 'Saurabh Patil',
    email: 'saurabh@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Sales',
    jobTitle: 'Sales Manager',
    phone: '+91 94567 12200',
    address: '21, Deccan, Pune',
    salary: 85000,
  },
  {
    employeeId: 'EMP013',
    name: 'Ritu Sharma',
    email: 'ritu@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Marketing',
    jobTitle: 'Content Writer',
    phone: '+91 96789 13300',
    address: '6, Karve Nagar, Pune',
    salary: 45000,
  },
  {
    employeeId: 'EMP014',
    name: 'Nikhil Bhosale',
    email: 'nikhil@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Mobile Developer',
    phone: '+91 97890 14400',
    address: '28, Kondhwa, Pune',
    salary: 76000,
  },
  {
    employeeId: 'EMP015',
    name: 'Swati Jain',
    email: 'swati@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'HR',
    jobTitle: 'Recruitment Specialist',
    phone: '+91 98901 15500',
    address: '19, Bibwewadi, Pune',
    salary: 51000,
  },
  {
    employeeId: 'EMP016',
    name: 'Gaurav Tiwari',
    email: 'gaurav@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'QA Engineer',
    phone: '+91 90123 16600',
    address: '41, Pashan, Pune',
    salary: 62000,
  },
  {
    employeeId: 'EMP017',
    name: 'Meera Iyer',
    email: 'meera@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Finance',
    jobTitle: 'Finance Manager',
    phone: '+91 91234 17700',
    address: '55, Erandwane, Pune',
    salary: 92000,
  },
  {
    employeeId: 'EMP018',
    name: 'Sachin Deshpande',
    email: 'sachin@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Operations',
    jobTitle: 'Operations Executive',
    phone: '+91 92345 18800',
    address: '12, Warje, Pune',
    salary: 56000,
  },
  {
    employeeId: 'EMP019',
    name: 'Kavita Rane',
    email: 'kavita@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Marketing',
    jobTitle: 'Digital Marketing Lead',
    phone: '+91 93456 19900',
    address: '7, Baner, Pune',
    salary: 69000,
  },
  {
    employeeId: 'EMP020',
    name: 'Tushar Naik',
    email: 'tushar@dayflow.in',
    password: 'Employee@1234',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Data Engineer',
    phone: '+91 94567 20000',
    address: '38, Kharadi, Pune',
    salary: 84000,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  console.log('Cleared existing users');

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await User.create({ ...u, passwordHash });
    console.log(`✓ ${u.role.toUpperCase().padEnd(8)} ${u.name} — ${u.email}`);
  }

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────');
  console.log('Admin logins:');
  console.log('  shubhamdtasagave@gmail.com / Admin@1234');
  console.log('  Asha@gmail.com           / Admin@1234');
  console.log('  aradhya@gmai.com         / Admin@1234');
  console.log('Employee login:');
  console.log('  priya@dayflow.in           / Employee@1234');
  console.log('─────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
