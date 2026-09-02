# Dayflow — Human Resource Management System

A full-stack HRMS built during a hackathon. Manages employees, attendance, leave requests, and payroll with role-based access for admins and employees.

---

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React (Vite) + Tailwind CSS |
| Backend  | Node.js + Express           |
| Database | MongoDB Atlas               |
| Auth     | JWT (role-based)            |
| Charts   | Recharts                    |
| PDF      | jsPDF + jspdf-autotable     |

---

## Features

### Auth

- Sign up with employee ID, email, password, role (admin/employee)
- Password strength validation (8+ chars, uppercase, number, special char)
- JWT issued on sign in, stored in localStorage
- Protected routes — auto-redirect to sign in on token expiry

### Employee

- Dashboard with quick-access cards, live attendance & leave widgets, pie charts
- Attendance — check in / check out, view history
- Leave Requests — apply for sick/casual/annual leave, view balance (12/6/6 days), status tracking
- Payroll — view payslips, download PDF payslip
- Profile — view all info, edit phone, address, profile picture

### Admin

- Dashboard with live stats (total employees, pending leaves, present/absent today)
- Analytics charts — leaves by department, attendance trend (7 days), payroll cost by department
- Employee list table
- Attendance — view all records, filter by employee, export CSV
- Leave Approvals — approve/reject with note, balance auto-deducted on approval
- Payroll — generate payslips (bonus as %), issue payslips, download PDF, export CSV
- Profile — view and edit all employee fields including salary

---

## Project Structure

```
dayflow/
├── client/                  # React frontend
│   └── src/
│       ├── api/axios.js     # Pre-configured axios (auto-attaches JWT)
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── EmployeeCharts.jsx
│       │   └── ui/          # Button, Card, Badge, Input, Select, Table, Modal, Toast
│       └── pages/
│           ├── SignIn.jsx
│           ├── SignUp.jsx
│           ├── EmployeeDashboard.jsx
│           ├── AdminDashboard.jsx
│           ├── Attendance.jsx
│           ├── Leaves.jsx
│           ├── Payroll.jsx
│           └── Profile.jsx
└── server/                  # Express backend
    ├── models/              # User, Attendance, Leave, Payroll
    ├── controllers/         # auth, user, attendance, leave, payroll, admin
    ├── routes/              # /api/auth, /api/users, /api/attendance, /api/leaves, /api/payroll, /api/admin
    ├── middleware/auth.js   # protect, requireAdmin
    └── server.js
```

---

## 🎥 Demo Video

[▶️ Watch the Dayflow HRMS Demo Video](./demo_video.mp4)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Shubham-3105/Dayflow-Human-Resource-Management-System1.git
cd Dayflow-Human-Resource-Management-System1
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dayflow
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

### 3. Set up the client

```bash
cd client
npm install
```

### 4. Seed the database

```bash
cd server
node seed.js
```

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — backend
cd server && npx nodemon server.js

# Terminal 2 — frontend
cd client && npx vite
```

Open **http://localhost:5173**

---

## Demo Credentials

| Role     | Email                      | Password      |
| -------- | -------------------------- | ------------- |
| Admin    | shubhamdtasagave@gmail.com | Admin@1234    |
| Admin    | Asha@gmail.com             | Admin@1234    |
| Admin    | aradhya@gmail.com          | Admin@1234    |
| Employee | priya@dayflow.in           | Employee@1234 |
| Employee | arjun@dayflow.in           | Employee@1234 |

---

## API Reference

All responses follow `{ success: true/false, data, message }`.

| Method | Endpoint                 | Auth      | Description        |
| ------ | ------------------------ | --------- | ------------------ |
| POST   | /api/auth/signup         | —         | Register           |
| POST   | /api/auth/signin         | —         | Login              |
| GET    | /api/users/me            | employee+ | Own profile        |
| PUT    | /api/users/me            | employee+ | Update own profile |
| GET    | /api/users               | admin     | List all employees |
| PUT    | /api/users/:id           | admin     | Edit any employee  |
| POST   | /api/attendance/checkin  | employee+ | Check in           |
| POST   | /api/attendance/checkout | employee+ | Check out          |
| GET    | /api/attendance/me       | employee+ | Own attendance     |
| GET    | /api/attendance          | admin     | All attendance     |
| POST   | /api/leaves              | employee+ | Apply for leave    |
| GET    | /api/leaves/me           | employee+ | Own leave requests |
| GET    | /api/leaves/balance      | employee+ | Leave balance      |
| GET    | /api/leaves              | admin     | All leave requests |
| PUT    | /api/leaves/:id/approve  | admin     | Approve leave      |
| PUT    | /api/leaves/:id/reject   | admin     | Reject leave       |
| POST   | /api/payroll/generate    | admin     | Generate payslip   |
| GET    | /api/payroll/me          | employee+ | Own payslips       |
| GET    | /api/payroll             | admin     | All payslips       |
| PUT    | /api/payroll/:id/issue   | admin     | Issue payslip      |
| GET    | /api/admin/stats         | admin     | Dashboard stats    |
| GET    | /api/admin/analytics     | admin     | Charts data        |

---

## Adding a New Page (for teammates)

1. Create `client/src/pages/YourPage.jsx`
2. Import and add a route in `client/src/App.jsx` inside `<PrivateRoute>`
3. Use `import api from '../api/axios'` for API calls
4. Use `const { user } = useAuth()` for current user info

Auth token is attached automatically. No extra setup needed.

---

## Leave Balance Defaults

| Type          | Default Days |
| ------------- | ------------ |
| Sick          | 6 days       |
| Casual        | 6 days       |
| Annual (Paid) | 12 days      |

Balances are stored per user and deducted when admin approves a leave request. Approval is blocked if balance is insufficient.

---

## Team

Built at OddoxHackathon 2026.
