import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setEmployees(data.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const adminCount    = employees.filter(e => e.role === 'admin').length;
  const employeeCount = employees.filter(e => e.role === 'employee').length;

  const filtered = employees.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Employees', value: employees.length, gradient: 'from-blue-500 to-cyan-500',    icon: '👥', sub: 'Registered accounts' },
    { label: 'HR / Admins',     value: adminCount,        gradient: 'from-violet-500 to-purple-600', icon: '🛡️', sub: 'Admin access' },
    { label: 'Staff Members',   value: employeeCount,     gradient: 'from-emerald-500 to-teal-500',  icon: '💼', sub: 'Active employees' },
  ];

  const AVATAR_GRADIENTS = [
    'from-blue-400 to-indigo-500',
    'from-violet-400 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-orange-400 to-rose-500',
    'from-pink-400 to-rose-500',
  ];

  return (
    <div className="space-y-6 page-enter">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-3xl p-7 text-white overflow-hidden shine">
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-3 border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Admin Panel
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-1">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-slate-400 text-sm">Here's your organization at a glance</p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10 backdrop-blur-sm">
            🏢
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, gradient, icon, sub }) => (
            <div key={label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-md`}>
                  {icon}
                </div>
                <span className="text-xs text-gray-400 font-medium">{sub}</span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Employee table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="section-title">All Employees</h3>
            <p className="text-xs text-gray-400 mt-0.5">Manage and view your team</p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <span className="badge bg-blue-50 text-blue-600">{filtered.length} shown</span>
            )}
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search employees…"
              className="input-field py-1.5 text-xs w-44"
            />
          </div>
        </div>

        {loading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/3" />
                  <div className="h-2 bg-gray-100 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="m-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            ⚠ {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Employee', 'Email', 'Role', 'Job Role', 'Department', 'Job Title'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp, i) => (
                  <tr key={emp._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}>
                          {emp.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {emp.jobRole
                        ? <span className="badge bg-teal-100 text-teal-700">{emp.jobRole}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{emp.department || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{emp.jobTitle || <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    {search ? `No results for "${search}"` : 'No employees found'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Placeholder modules */}
      <div className="grid md:grid-cols-2 gap-4">
        {[['Attendance Overview', '📊'], ['Leave Approvals', '📋']].map(([title, icon]) => (
          <div key={title} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-title">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">Coming soon</p>
              </div>
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="space-y-2.5">
              {[100, 75, 50].map((w, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
