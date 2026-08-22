import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Fields any user can edit on their own profile
const EMPLOYEE_EDITABLE = ['phone', 'address'];
// Fields only admin can edit (when viewing another employee or their own)
const ADMIN_EDITABLE = ['name', 'employeeId', 'department', 'jobTitle', 'salary', 'role', 'phone', 'address'];

// All display fields (read-only for employee unless in editable list above)
const ALL_FIELDS = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'jobTitle', label: 'Job Title' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'salary', label: 'Salary (admin only)', adminOnly: true },
];

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((f) => ({ ...f, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Build payload with only editable fields + profilePicture
      const payload = {};
      editableKeys.forEach((k) => { if (form[k] !== undefined) payload[k] = form[k]; });
      payload.profilePicture = form.profilePicture || '';

      const { data } = await api.put('/users/me', payload);
      setProfile(data.data);
      updateUser({ ...authUser, ...data.data });
      setEditing(false);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-gray-400 text-sm">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        {!editing ? (
          <button
            onClick={() => { setEditing(true); setSuccess(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setEditing(false); setForm(profile); setPreview(profile.profilePicture || ''); }} className="text-sm text-gray-500 hover:underline">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded">{success}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Profile picture */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-2xl">
            {preview
              ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
              : profile.name?.[0]?.toUpperCase()}
          </div>
          {editing && (
            <div>
              <label className="text-xs text-blue-600 cursor-pointer hover:underline">
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePicture} />
              </label>
              <p className="text-xs text-gray-400">JPG, PNG, max ~500 KB</p>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {ALL_FIELDS.filter((f) => !f.adminOnly || isAdmin).map(({ key, label }) => {
            const isEditable = editing && editableKeys.includes(key);
            return (
              <div key={key} className="grid grid-cols-3 gap-2 items-start">
                <span className="text-xs text-gray-400 pt-2">{label}</span>
                {isEditable ? (
                  <input
                    name={key}
                    value={form[key] ?? ''}
                    onChange={handleChange}
                    className="col-span-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="col-span-2 text-sm text-gray-800 py-1.5">
                    {key === 'salary' ? (profile[key] ? `$${profile[key].toLocaleString()}` : '—') : profile[key] || '—'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isAdmin && (
        <p className="text-xs text-gray-400 mt-3">
          You can update phone, address, and profile picture. Contact HR to change other details.
        </p>
      )}
    </div>
  );
}
