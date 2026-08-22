import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const passwordRules = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export default function SignUp() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ employeeId: '', name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'password') {
      setPwError(passwordRules.test(value) ? '' : 'Min 8 chars, 1 uppercase, 1 number, 1 special char (!@#$%^&*)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRules.test(form.password)) {
      setPwError('Min 8 chars, 1 uppercase, 1 number, 1 special char');
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">DF</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Dayflow</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-snug mb-4">
            Join your team<br />on Dayflow.
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            Create your account to start tracking attendance, managing leave, and staying connected with your team.
          </p>
          <div className="mt-8 space-y-3">
            {['✓  Punch in & out from anywhere', '✓  View your payslips instantly', '✓  Apply for leave in seconds'].map(t => (
              <p key={t} className="text-blue-100 text-sm">{t}</p>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-xs">© 2024 Dayflow HRMS</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">DF</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Dayflow</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-8">Fill in the details below to get started</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Employee ID</label>
                <input name="employeeId" value={form.employeeId} onChange={handleChange}
                  placeholder="EMP001" required className="input-field" />
              </div>
              <div>
                <label className="label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Jane Doe" required className="input-field" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="jane@company.com" required className="input-field" />
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required className="input-field" />
              {pwError && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {pwError}
                </p>
              )}
            </div>

            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="employee">Employee</option>
                <option value="admin">HR / Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
