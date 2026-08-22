import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EMPLOYEE_EDITABLE = ['phone', 'address', 'jobRole'];
const ADMIN_EDITABLE    = ['name', 'employeeId', 'department', 'jobTitle', 'jobRole', 'salary', 'role', 'phone', 'address'];

const JOB_ROLES = [
  '', 'Software Engineer', 'Senior Software Engineer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Analyst', 'Data Scientist', 'Product Manager', 'Project Manager',
  'UI/UX Designer', 'Graphic Designer', 'HR Manager', 'HR Executive',
  'Finance Manager', 'Accountant', 'Marketing Manager', 'Sales Executive',
  'Business Analyst', 'QA Engineer', 'Team Lead', 'Engineering Manager',
  'CTO', 'CEO', 'Intern', 'Other',
];

const ALL_FIELDS = [
  { key: 'employeeId', label: 'Employee ID',  icon: '🪪' },
  { key: 'name',       label: 'Full Name',     icon: '👤' },
  { key: 'email',      label: 'Email',         icon: '✉️' },
  { key: 'role',       label: 'System Role',   icon: '🛡️' },
  { key: 'department', label: 'Department',    icon: '🏢' },
  { key: 'jobRole',    label: 'Job Role',      icon: '🎯', type: 'select', adminOnly: false },
  { key: 'jobTitle',   label: 'Job Title',     icon: '💼' },
  { key: 'phone',      label: 'Phone',         icon: '📱' },
  { key: 'address',    label: 'Address',       icon: '📍' },
  { key: 'salary',     label: 'Salary',        icon: '💰', adminOnly: true },
];

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';

  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setProfile(data.data);
      setForm(data.data);
      setPreview(data.data.profilePicture || '');
    });
  }, []);

  const editableKeys = isAdmin ? ADMIN_EDITABLE : EMPLOYEE_EDITABLE;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setForm(f => ({ ...f, profilePicture: reader.result })); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = {};
      editableKeys.forEach(k => { if (form[k] !== undefined) payload[k] = form[k]; });
      payload.profilePicture = form.profilePicture || '';
      const { data } = await api.put('/users/me', payload);
      setProfile(data.data);
      updateUser({ ...authUser, ...data.data });
      setEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading profile…</p>
      </div>
    </div>
  );

  const initials = profile.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
                {preview
                  ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  : initials}
              </div>
              {editing && (
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="text-xs">✏️</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.jobTitle || 'No title'} · {profile.department || 'No department'}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {profile.role}
                </span>
                {profile.jobRole && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-100 text-teal-700">
                    {profile.jobRole}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editing ? (
              <button onClick={() => { setEditing(true); setSuccess(''); }} className="btn-secondary">
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={() => { setEditing(false); setForm(profile); setPreview(profile.profilePicture || ''); }} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <span>⚠</span> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
          <span>✓</span> {success}
        </div>
      )}

      {/* Fields */}
      <div className="card divide-y divide-gray-50">
        {ALL_FIELDS.filter(f => !f.adminOnly || isAdmin).map(({ key, label, icon, type }) => {
          const isEditable = editing && editableKeys.includes(key);
          return (
            <div key={key} className="flex items-center gap-4 px-6 py-4">
              <span className="text-lg w-6 flex-shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                {isEditable ? (
                  type === 'select' ? (
                    <select
                      name={key}
                      value={form[key] ?? ''}
                      onChange={handleChange}
                      className="input-field py-1.5 text-sm"
                    >
                      <option value="">— Select job role —</option>
                      {JOB_ROLES.filter(r => r !== '').map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={key}
                      value={form[key] ?? ''}
                      onChange={handleChange}
                      className="input-field py-1.5 text-sm"
                    />
                  )
                ) : (
                  <p className="text-sm text-gray-800 font-medium truncate">
                    {key === 'salary'
                      ? (profile[key] ? `$${profile[key].toLocaleString()}` : '—')
                      : profile[key] || <span className="text-gray-300 font-normal">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isAdmin && (
        <p className="text-xs text-gray-400 px-1">
          You can update phone, address, job role, and profile photo. Contact HR to change other details.
        </p>
      )}
    </div>
  );
}
