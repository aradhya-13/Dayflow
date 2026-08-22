import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setEmployees(data.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const adminCount    = employees.filter(e => e.role === 'admin').length;
  const employeeCount = employees.filter(e => e.role === 'employee').length;

  const stats = [
    { label: 'Total Employees', value: employees.length, color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'Admins / HR', value: adminCount, color: 'from-purple-500 to-purple-600', icon: '🛡️' },
    { label: 'Staff Members', value: employeeCount, color: 'from-emerald-500 to-teal-600', icon: '💼' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <p className="text-slate-400 text-sm mb-1">Admin Panel</p>
        <h2 className="text-2xl font-bold mb-0.5">Welcome back, {user?.name?.split(' ')[0]}</h2>
        <p className="text-slate-400 text-sm">Here's an overview of your organization</p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, color, icon }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-sm mb-3`}>
                {icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Employee table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="section-title">All Employees</h3>
            <p className="text-xs text-gray-400 mt-0.5">Manage your team members</p>
          </div>
          {!loading && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {employees.length} total
            </span>
          )}
        </div>

        {loading && (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        )}
        {error && (
          <div className="m-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['Employee', 'Email', 'Role', 'Job Role', 'Department', 'Job Title'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map(emp => (
                  <tr key={emp._id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                          {emp.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        emp.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {emp.jobRole
                        ? <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-teal-100 text-teal-700">{emp.jobRole}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{emp.department || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-3.5 text-gray-600">{emp.jobTitle || <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Placeholder modules */}
      <div className="grid md:grid-cols-2 gap-4">
        <PlaceholderCard title="Attendance Overview" hint="Attendance module" />
        <PlaceholderCard title="Leave Approvals" hint="Leave module" />
      </div>
    </div>
  );
}

function PlaceholderCard({ title, hint }) {
  return (
    <div className="card p-6 border-dashed border-gray-200 bg-gray-50/50">
      <p className="section-title">{title}</p>
      <p className="text-xs text-gray-400 mt-1">— {hint} goes here —</p>
      <div className="mt-4 space-y-2">
        {[1,2].map(i => <div key={i} className="h-8 bg-gray-200/60 rounded-lg animate-pulse" />)}
      </div>
    </div>
  );
}
