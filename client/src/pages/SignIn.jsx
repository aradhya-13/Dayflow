import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/signin', form);
      signin(data.data.token, data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">DF</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Dayflow</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Manage your<br />workforce smarter.
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Track attendance, manage leave requests, and streamline HR processes — all in one place.
          </p>
          <div className="mt-10 flex gap-4">
            {['Attendance', 'Leave', 'Payroll', 'Profiles'].map(f => (
              <div key={f} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium text-blue-100 border border-white/10">
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-xs">© 2024 Dayflow HRMS</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">DF</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Dayflow</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="jane@company.com"
                required className="input-field"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                required className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
