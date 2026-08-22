/**
 * Navbar — drop this into any page by wrapping with PrivateRoute in App.jsx.
 * It already appears on all protected pages via the layout in App.jsx.
 *
 * Role-based nav:
 *   - Both roles: Profile
 *   - Employee only: Dashboard, Attendance*, Leave Requests*, Payroll*
 *   - Admin only: Admin Dashboard, All Employees
 *   (* placeholder links — teammates fill these in)
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  const isActive = (path) =>
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/leaves', label: 'Leave Requests' },
    { to: '/payroll', label: 'Payroll' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/leaves', label: 'Leave Approvals' },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/dashboard" className="text-blue-600 font-bold text-xl tracking-tight">
          Dayflow
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className={isActive(to)}>
              {label}
            </Link>
          ))}
          <Link to="/profile" className={isActive('/profile')}>
            Profile
          </Link>
        </div>

        {/* User info + signout */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {user?.name} <span className="text-xs bg-gray-100 rounded px-1">{user?.role}</span>
          </span>
          <button
            onClick={handleSignout}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Sign out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-gray-100 pt-3">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className={isActive(to)} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <button onClick={handleSignout} className="text-left text-red-500 hover:text-red-700">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
