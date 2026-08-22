import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  { label: 'Profile', desc: 'View and update your info', icon: '👤', to: '/profile' },
  { label: 'Attendance', desc: 'Check in / Check out', icon: '🕐', to: '/attendance' },
  { label: 'Leave Requests', desc: 'Apply for leave', icon: '📋', to: '/leaves' },
  { label: 'Payroll', desc: 'View your payslips', icon: '💰', to: '/payroll' },
];

export default function EmployeeDashboard() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Hello, {user?.name} 👋
      </h2>
      <p className="text-sm text-gray-500 mb-6">{user?.jobTitle || 'Employee'} · {user?.department || 'No department'}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, desc, icon, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md transition hover:border-blue-200 group"
          >
            <span className="text-3xl block mb-3">{icon}</span>
            <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {/* Placeholder sections for teammates */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Placeholder title="Recent Attendance" />
        <Placeholder title="Pending Leave Requests" />
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-xs text-gray-300 mt-1">— teammate fills this in —</p>
    </div>
  );
}
