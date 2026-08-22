import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignout = () => { signout(); navigate('/signin'); };

  const isActive = (path) => location.pathname === path;

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/attendance', label: 'Attendance', icon: '◷' },
    { to: '/leaves', label: 'Leave', icon: '◈' },
    { to: '/payroll', label: 'Payroll', icon: '◎' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '⊞' },
    { to: '/attendance', label: 'Attendance', icon: '◷' },
    { to: '/leaves', label: 'Approvals', icon: '◈' },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">DF</span>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">
            Dayflow
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(to)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/profile"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive('/profile')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Profile
          </Link>
        </div>

        {/* User + signout */}
        <div className="hidden md:flex items-center gap-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {user?.role}
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
          </div>
          <button onClick={handleSignout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Sign out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100 bg-white">
          {[...links, { to: '/profile', label: 'Profile' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <button onClick={handleSignout} className="text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
