import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setEmployees(data.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));

    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .finally(() => setStatsLoading(false));

    api.get('/admin/analytics')
      .then(({ data }) => setAnalytics(data.data))
      .finally(() => setAnalyticsLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Employees', value: stats.totalEmployees, color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'Pending Leaves', value: stats.pendingLeaves, color: 'from-amber-500 to-orange-500', icon: '📋' },
    { label: 'Present Today', value: stats.presentToday, color: 'from-emerald-500 to-teal-600', icon: '✅' },
    { label: 'Absent Today', value: stats.absentToday, color: 'from-red-500 to-red-600', icon: '❌' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <p className="text-slate-400 text-sm mb-1">Admin Panel</p>
        <h2 className="text-2xl font-bold mb-0.5">Welcome back, {user?.name?.split(' ')[0]}</h2>
        <p className="text-slate-400 text-sm">Here's an overview of your organization</p>
      </div>

      {/* Stats — 4 cards from /api/admin/stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading
          ? [1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24 animate-pulse" />)
          : statCards.map(({ label, value, color, icon }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-sm mb-3`}>
                {icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))
        }
      </div>

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

      {/* Analytics */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Analytics</h3>
        <div className="grid md:grid-cols-3 gap-4">

          {/* Leaves by Department */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Approved Leaves by Department</p>
            {analyticsLoading ? <ChartSkeleton /> : !analytics?.leavesByDepartment?.length ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.leavesByDepartment} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} name="Leaves" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Attendance Trend */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Attendance — Last 7 Days</p>
            {analyticsLoading ? <ChartSkeleton /> : !analytics?.attendanceTrend?.length ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.attendanceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip labelFormatter={d => `Date: ${d}`} />
                  <Legend iconSize={10} />
                  <Line type="monotone" dataKey="presentCount" stroke="#16a34a" strokeWidth={2} dot={false} name="Present" />
                  <Line type="monotone" dataKey="absentCount"  stroke="#dc2626" strokeWidth={2} dot={false} name="Absent" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Payroll by Department */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Payroll Cost by Department (This Month)</p>
            {analyticsLoading ? <ChartSkeleton /> : !analytics?.payrollByDepartment?.length ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.payrollByDepartment} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => `Rs.${v.toLocaleString()}`} />
                  <Bar dataKey="totalNetSalary" fill="#f59e0b" radius={[4,4,0,0]} name="Net Salary" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
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

function ChartSkeleton() {
  return <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />;
}

function EmptyChart() {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-gray-400">
      <p className="text-2xl mb-2">📊</p>
      <p className="text-xs">No data yet</p>
    </div>
  );
}
