import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setEmployees(data.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Employee list table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-700 text-sm">All Employees</h3>
        </div>

        {loading && <p className="text-sm text-gray-400 p-5">Loading…</p>}
        {error && <p className="text-sm text-red-500 p-5">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['ID', 'Name', 'Email', 'Role', 'Department', 'Job Title'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{emp.employeeId}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{emp.department || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{emp.jobTitle || '—'}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-sm">No employees yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Placeholder sections for teammates */}
      <div className="grid md:grid-cols-2 gap-4">
        <Placeholder title="Attendance Records" hint="Attendance module goes here" />
        <Placeholder title="Leave Approvals" hint="Leave module goes here" />
      </div>
    </div>
  );
}

function Placeholder({ title, hint }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xs text-gray-300 mt-1">— {hint} —</p>
    </div>
  );
}
