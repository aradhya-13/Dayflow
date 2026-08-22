import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LEAVE_TYPES = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'annual', label: 'Annual Leave' },
];

const statusVariant = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const balanceKey = { sick: 'sick', casual: 'casual', annual: 'annual' };

export default function Leaves() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminView /> : <EmployeeView />;
}

function EmployeeView() {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => {
    Promise.all([api.get('/leaves/me'), api.get('/leaves/balance')])
      .then(([lr, br]) => { setLeaves(lr.data.data); setBalance(br.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/leaves', form);
      toast.success('Leave request submitted');
      setForm({ leaveType: '', startDate: '', endDate: '', reason: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  const selectedBalance = form.leaveType && balance ? balance[balanceKey[form.leaveType]] : null;
  const requestedDays = form.startDate && form.endDate
    ? Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000*60*60*24)) + 1) : 0;

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-neutral-800">Leave Requests</h2>

      {/* Balance cards */}
      {balance && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'sick', label: 'Sick Leave', color: 'bg-red-50 border-red-100', text: 'text-red-600' },
            { key: 'casual', label: 'Casual Leave', color: 'bg-amber-50 border-amber-100', text: 'text-amber-600' },
            { key: 'annual', label: 'Annual Leave', color: 'bg-blue-50 border-blue-100', text: 'text-blue-600' },
          ].map(({ key, label, color, text }) => (
            <div key={key} className={`rounded-xl border p-4 ${color}`}>
              <p className={`text-2xl font-bold ${text}`}>{balance[key].remaining}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
              <p className="text-xs text-neutral-400">{balance[key].used} used / {balance[key].total} total</p>
            </div>
          ))}
        </div>
      )}

      {/* Apply form */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Apply for Leave</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Leave Type</label>
            <select name="leaveType" value={form.leaveType} onChange={handleChange} required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select type...</option>
              {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {selectedBalance && (
              <p className={`text-xs mt-1 ${requestedDays > selectedBalance.remaining ? 'text-red-500' : 'text-neutral-400'}`}>
                {selectedBalance.remaining} day(s) remaining
                {requestedDays > 0 && ` — you are requesting ${requestedDays} day(s)`}
                {requestedDays > selectedBalance.remaining && ' (exceeds balance)'}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Reason</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} required rows={3}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      {/* My requests */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-700">My Requests</h3>
        </div>
        {loading ? <p className="text-sm text-neutral-400 p-5">Loading...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
              <tr>
                {['Type','From','To','Reason','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leaves.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400">No requests yet</td></tr>
              )}
              {leaves.map(l => (
                <tr key={l._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 capitalize">{l.leaveType}</td>
                  <td className="px-4 py-3">{l.startDate}</td>
                  <td className="px-4 py-3">{l.endDate}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{l.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusVariant[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminView() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [note, setNote] = useState('');
  const [acting, setActing] = useState(false);

  const fetchLeaves = () => {
    api.get('/leaves').then(({ data }) => setLeaves(data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeaves(); }, []);

  const approve = async (id) => {
    setActing(true);
    try { await api.put(`/leaves/${id}/approve`); toast.success('Leave approved'); fetchLeaves(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setActing(false); }
  };

  const reject = async () => {
    setActing(true);
    try {
      await api.put(`/leaves/${rejectId}/reject`, { reviewNote: note });
      toast.success('Leave rejected');
      setRejectId(null); setNote(''); fetchLeaves();
    } catch { toast.error('Failed'); }
    finally { setActing(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Leave Approvals</h2>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-700">All Requests</h3>
        </div>
        {loading ? <p className="p-5 text-sm text-neutral-400">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                <tr>
                  {['Employee','Type','From','To','Reason','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leaves.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">No requests</td></tr>
                )}
                {leaves.map(l => (
                  <tr key={l._id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">
                      {l.employeeName}<br /><span className="text-xs text-neutral-400">{l.employeeId}</span>
                    </td>
                    <td className="px-4 py-3 capitalize">{l.leaveType}</td>
                    <td className="px-4 py-3">{l.startDate}</td>
                    <td className="px-4 py-3">{l.endDate}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{l.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusVariant[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {l.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => approve(l._id)} disabled={acting}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50">
                            Approve
                          </button>
                          <button onClick={() => { setRejectId(l._id); setNote(''); }} disabled={acting}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50">
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40" onClick={() => setRejectId(null)} />
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm z-10 p-6">
            <h3 className="font-semibold text-neutral-800 mb-3">Reject Leave</h3>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Reason for rejection (optional)" rows={3}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectId(null)} className="text-sm text-neutral-500 hover:underline">Cancel</button>
              <button onClick={reject} disabled={acting}
                className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-60">
                {acting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
