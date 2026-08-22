/**
 * EmployeeCharts — two pie charts for any employee:
 *   1. Leave balance (approved vs remaining out of annual allocation)
 *   2. Attendance this month (present / absent / late)
 *
 * Usage:
 *   <EmployeeCharts />   — reads current user from useAuth(), fetches own data
 */
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

// Annual leave allocation per type (days)
const LEAVE_ALLOCATION = { sick: 10, casual: 8, annual: 15 };

const ATTENDANCE_COLORS = {
  Present: '#4f46e5',
  Absent:  '#f87171',
  Late:    '#f59e0b',
};

const LEAVE_COLORS = ['#f87171', '#4f46e5', '#34d399'];

export default function EmployeeCharts() {
  const [leaveData, setLeaveData]         = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/leaves/me'),
      api.get('/attendance/me'),
    ]).then(([leavesRes, attendanceRes]) => {
      buildLeaveData(leavesRes.data.data);
      buildAttendanceData(attendanceRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const buildLeaveData = (leaves) => {
    // Count approved days per type
    const used = { sick: 0, casual: 0, annual: 0 };
    leaves.forEach((l) => {
      if (l.status === 'approved') {
        const days = daysBetween(l.startDate, l.endDate);
        if (used[l.leaveType] !== undefined) used[l.leaveType] += days;
      }
    });

    const data = Object.entries(LEAVE_ALLOCATION).map(([type, total]) => ({
      name: `${cap(type)} Used`,
      value: Math.min(used[type], total),
      remaining: total - Math.min(used[type], total),
      total,
      type,
    }));

    // Flatten into used/remaining pairs for the pie
    const flat = [];
    data.forEach((d) => {
      if (d.value > 0)     flat.push({ name: `${cap(d.type)} Used`, value: d.value });
      if (d.remaining > 0) flat.push({ name: `${cap(d.type)} Left`, value: d.remaining });
    });

    setLeaveData(flat.length ? flat : [{ name: 'All leaves available', value: 1 }]);
  };

  const buildAttendanceData = (records) => {
    // Filter to current month
    const now = new Date();
    const thisMonth = records.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const counts = { Present: 0, Absent: 0, Late: 0 };
    thisMonth.forEach((r) => {
      const s = cap(r.status);
      if (counts[s] !== undefined) counts[s]++;
    });

    const data = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));

    setAttendanceData(data.length ? data : [{ name: 'No records yet', value: 1 }]);
  };

  if (loading) return <p className="text-sm text-neutral-400">Loading charts…</p>;

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <ChartCard title="Leave Balance">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={leaveData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value">
              {leaveData.map((_, i) => (
                <Cell key={i} fill={LEAVE_COLORS[i % LEAVE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v} days`, n]} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
        <Allocation />
      </ChartCard>

      <ChartCard title={`Attendance — ${new Date().toLocaleString('default', { month: 'long' })}`}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value">
              {attendanceData.map((entry) => (
                <Cell key={entry.name} fill={ATTENDANCE_COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v} days`, n]} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
      <p className="text-sm font-semibold text-neutral-700 mb-2">{title}</p>
      {children}
    </div>
  );
}

function Allocation() {
  return (
    <div className="mt-2 flex justify-center gap-6 text-xs text-neutral-500">
      <span>🟦 Sick: 10 days</span>
      <span>🟩 Casual: 8 days</span>
      <span>🟧 Annual: 15 days</span>
    </div>
  );
}

// helpers
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const daysBetween = (a, b) => {
  const diff = new Date(b) - new Date(a);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
};
