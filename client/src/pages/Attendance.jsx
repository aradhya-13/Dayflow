import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ─── Shared ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  present: { cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  late:    { cls: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'   },
  absent:  { cls: 'bg-red-100 text-red-600',         dot: 'bg-red-500'     },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { cls: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function EmptyState({ message = 'No records found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function AttendanceTable({ records, showEmployee = true }) {
  if (records.length === 0) return <EmptyState />;

  const headers = showEmployee
    ? ['Date', 'Employee', 'Check-In', 'Check-Out', 'Hours', 'Status']
    : ['Date', 'Check-In', 'Check-Out', 'Hours Worked', 'Status'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {headers.map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {records.map(r => (
            <tr key={r._id} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-6 py-3.5 text-gray-700 font-medium">{r.date}</td>
              {showEmployee && (
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {r.employeeName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{r.employeeName}</p>
                      <p className="text-xs text-gray-400">{r.employeeId}</p>
                    </div>
                  </div>
                </td>
              )}
              <td className="px-6 py-3.5">
                {r.checkIn
                  ? <span className="inline-flex items-center gap-1 text-gray-700"><span className="text-emerald-500">↑</span>{r.checkIn}</span>
                  : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-6 py-3.5">
                {r.checkOut
                  ? <span className="inline-flex items-center gap-1 text-gray-700"><span className="text-red-400">↓</span>{r.checkOut}</span>
                  : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-6 py-3.5">
                {r.checkOut
                  ? <span className="font-semibold text-gray-800">{r.hoursWorked}h</span>
                  : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-6 py-3.5"><StatusBadge status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Employee View ────────────────────────────────────────────────────────────

function EmployeeAttendance() {
  const { user } = useAuth();
  const [records, setRecords]     = useState([]);
  const [todayRec, setTodayRec]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [acting, setActing]       = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const fetchRecords = useCallback(async () => {
    try {
      const { data } = await api.get('/attendance/me');
      setRecords(data.data);
      setTodayRec(data.data.find(r => r.date === todayStr) ?? null);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [todayStr]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleAction = async (type) => {
    setActionMsg(''); setActionErr(''); setActing(true);
    try {
      const { data } = await api.post(`/attendance/${type}`);
      setActionMsg(data.message);
      await fetchRecords();
    } catch (err) {
      setActionErr(err.response?.data?.message ?? 'Something went wrong');
    } finally { setActing(false); }
  };

  const checkedIn  = !!todayRec?.checkIn;
  const checkedOut = !!todayRec?.checkOut;

  // Stats
  const total   = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const late    = records.filter(r => r.status === 'late').length;
  const totalHrs = records.reduce((s, r) => s + (r.hoursWorked || 0), 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="page-title">My Attendance</h2>
        <p className="text-sm text-gray-500 mt-0.5">{todayDisplay}</p>
      </div>

      {/* Stats row */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Days Tracked', value: total,      color: 'text-gray-800' },
            { label: 'Present',      value: present,    color: 'text-emerald-600' },
            { label: 'Late',         value: late,       color: 'text-amber-600' },
            { label: 'Total Hours',  value: `${totalHrs}h`, color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Today's action */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Today's Attendance</h3>
            <p className="text-xs text-gray-400 mt-0.5">{todayStr}</p>
          </div>
          {todayRec && <StatusBadge status={todayRec.status} />}
        </div>

        {checkedIn && (
          <div className="flex gap-6 mb-5 text-sm">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl">
              <span className="text-emerald-500 font-medium">↑ Check-in</span>
              <span className="font-bold text-gray-800">{todayRec.checkIn}</span>
            </div>
            {checkedOut && (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl">
                <span className="text-red-400 font-medium">↓ Check-out</span>
                <span className="font-bold text-gray-800">{todayRec.checkOut}</span>
              </div>
            )}
            {checkedOut && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
                <span className="text-blue-500 font-medium">⏱ Hours</span>
                <span className="font-bold text-gray-800">{todayRec.hoursWorked}h</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            disabled={checkedIn || acting}
            onClick={() => handleAction('checkin')}
            className="btn-primary flex items-center gap-2 px-5"
          >
            {acting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : <span>↑</span>}
            Check In
          </button>
          <button
            disabled={!checkedIn || checkedOut || acting}
            onClick={() => handleAction('checkout')}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <span>↓</span> Check Out
          </button>
        </div>

        {actionMsg && (
          <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm">
            <span>✓</span> {actionMsg}
          </div>
        )}
        {actionErr && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl text-sm">
            <span>⚠</span> {actionErr}
          </div>
        )}
      </div>

      {/* History */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="section-title">Attendance History</h3>
            <p className="text-xs text-gray-400 mt-0.5">Your complete record</p>
          </div>
          {!loading && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {records.length} records
            </span>
          )}
        </div>
        {loading
          ? <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          : <AttendanceTable records={records} showEmployee={false} />
        }
      </div>
    </div>
  );
}

// ─── Admin View ───────────────────────────────────────────────────────────────

function AdminAttendance() {
  const [records, setRecords]         = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    api.get('/users').then(({ data }) => setEmployees(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true); setError('');
    const url = selectedEmp ? `/attendance/${selectedEmp}` : '/attendance';
    api.get(url)
      .then(({ data }) => setRecords(data.data))
      .catch(() => setError('Failed to load attendance records'))
      .finally(() => setLoading(false));
  }, [selectedEmp]);

  const presentCount = records.filter(r => r.status === 'present').length;
  const lateCount    = records.filter(r => r.status === 'late').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Attendance Records</h2>
        <p className="text-sm text-gray-500 mt-0.5">Monitor team attendance across your organisation</p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Records', value: records.length,  color: 'text-gray-800' },
            { label: 'On Time',       value: presentCount,    color: 'text-emerald-600' },
            { label: 'Late',          value: lateCount,       color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Filter by employee</label>
        <select
          value={selectedEmp}
          onChange={e => setSelectedEmp(e.target.value)}
          className="input-field sm:max-w-xs"
        >
          <option value="">All employees</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp.employeeId}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>
        {selectedEmp && (
          <button
            onClick={() => setSelectedEmp('')}
            className="text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="section-title">
              {selectedEmp ? `Records — ${selectedEmp}` : 'All Records'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Sorted by date, newest first</p>
          </div>
          {!loading && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {records.length} records
            </span>
          )}
        </div>

        {loading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        )}
        {error && (
          <div className="m-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <span>⚠</span> {error}
          </div>
        )}
        {!loading && !error && <AttendanceTable records={records} showEmployee={true} />}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Attendance() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminAttendance /> : <EmployeeAttendance />;
}
