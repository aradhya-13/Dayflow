import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    label: 'Profile',
    desc: 'View and update your info',
    to: '/profile',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: 'Attendance',
    desc: 'Check in & check out',
    to: '/attendance',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Leave Requests',
    desc: 'Apply for time off',
    to: '/leaves',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Payroll',
    desc: 'View your payslips',
    to: '/payroll',
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <p className="text-blue-200 text-sm mb-1">{today}</p>
        <h2 className="text-2xl font-bold mb-0.5">Hello, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-blue-200 text-sm">
          {user?.jobTitle || 'Employee'} · {user?.department || 'No department assigned'}
        </p>
      </div>

      {/* Quick access cards */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, desc, to, gradient, bg, icon }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="card p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm mb-4`}>
                {icon}
              </div>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{label}</p>
              <p className="text-xs text-gray-400 mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderCard title="Recent Attendance" subtitle="Your last 5 check-ins" />
        <PlaceholderCard title="Pending Leave Requests" subtitle="Awaiting approval" />
      </div>
    </div>
  );
}

function PlaceholderCard({ title, subtitle }) {
  return (
    <div className="card p-6">
      <p className="section-title mb-0.5">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
      <div className="mt-4 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
