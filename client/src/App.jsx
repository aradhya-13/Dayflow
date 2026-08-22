/**
 * App.jsx — routing root.
 *
 * HOW TEAMMATES ADD A NEW PAGE:
 * 1. Create your page in src/pages/YourPage.jsx
 * 2. Import it here and add a <Route> inside the relevant PrivateRoute wrapper.
 *    - For employee+admin access: inside the first <Route element={<PrivateRoute />}>
 *    - For admin-only: inside <Route element={<PrivateRoute adminOnly />}>
 * 3. Add a nav link in src/components/Navbar.jsx under the right role block.
 * That's it — auth is handled automatically.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Navbar from './components/Navbar';
import Toast from './components/ui/Toast';

// Wraps routes that require login. Pass adminOnly to restrict to admins.
function PrivateRoute({ adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toast />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Authenticated routes (employee + admin) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/profile" element={<Profile />} />
            {/* Teammates: add employee-level pages here */}
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/payroll" element={<Payroll />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Teammates: add admin pages here */}
          </Route>

          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Redirects /dashboard to the right dashboard based on role
function DashboardRedirect() {
  const { user } = useAuth();
  return user?.role === 'admin'
    ? <Navigate to="/admin" replace />
    : <EmployeeDashboard />;
}
