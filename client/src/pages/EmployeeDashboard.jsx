import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    label: 'Profile', desc: 'View and update your info', to: '/profile',
    gradient: 'from-violet-500 to-purple-600',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  },
  {
    label: 'Attendance', desc: 'Check in & check out', to: '/attendance',
    gradient: 'from-blue-500 to-cyan-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    label: 'Leave Requests', desc: 'Apply for time off', to: '/leaves',
    gradient: 'from-emerald-500 to-teal-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  },
  {
    label: 'Payroll', desc: 'View your payslips', to: '/payroll',
    gradient: 'from-orange-500 to-rose-500',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 page-enter">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-7 text-white overflow-hidden shine">
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-40px] left-1/2 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="text-blue-200/80 text-sm font-medium mb-1">{today}</p>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-blue-100/70 text-sm">
            {user?.jobTitle || user?.jobRole || 'Employee'} · {user?.department || 'No department assigned'}
          </p>
          <div className="mt-5 flex gap-3">
            <button onClick={() => navigate('/attendance')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
              Mark Attendance →
            </button>
            <button onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 text-xs font-medium px-4 py-2 rounded-xl transition-all">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Access</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, desc, to, gradient, icon }) => (
            <button key={label} onClick={() => navigate(to)}
              className="card p-5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{label}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-title">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-xs">...</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {[100, 85, 70].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
            <div className={`h-3 bg-gray-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
