import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Password must be 8+ chars, 1 uppercase, 1 number, 1 special char
const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export default function SignUp() {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: '', name: '', email: '', password: '', role: 'employee',
  });
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'password') {
      setPwError(
        passwordRules.test(value)
          ? ''
          : 'Min 8 chars, 1 uppercase, 1 number, 1 special character (!@#$%^&*)'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwError || !passwordRules.test(form.password)) {
      setPwError('Min 8 chars, 1 uppercase, 1 number, 1 special character');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/signup', form);
      signin(data.data.token, data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Dayflow HRMS</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP001" required />
          <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required />

          <div>
            <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            {pwError && <p className="text-xs text-amber-600 mt-1">{pwError}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="employee">Employee</option>
              <option value="admin">HR / Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
