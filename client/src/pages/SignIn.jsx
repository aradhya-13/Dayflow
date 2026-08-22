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

  const handleChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/signin', form);
      signin(data.data.token, data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex auth-bg">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[52%] relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex-col justify-between p-14 text-white overflow-hidden shine">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <span className="text-white font-black text-sm tracking-tight">DF</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">Dayflow</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            HR Management Platform
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-5 tracking-tight">
            Manage your<br />
            <span className="text-blue-200">workforce</span><br />
            smarter.
          </h1>
          <p className="text-blue-100/80 text-base leading-relaxed max-w-xs">
            Track attendance, manage leave, handle payroll — everything your team needs in one place.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap gap-2">
            {['Attendance Tracking', 'Leave Management', 'Payroll', 'Team Profiles'].map(f => (
              <div key={f} className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium text-white/90 border border-white/15">
                {f}
              </div>
            ))}
          </div>

          {/* Stat pills */}
          <div className="mt-8 flex gap-4">
            {[['99.9%', 'Uptime'], ['500+', 'Companies'], ['50k+', 'Employees']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-bold">{val}</p>
                <p className="text-xs text-blue-200">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300/60 text-xs relative z-10">© 2024 Dayflow HRMS. All rights reserved.</p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm page-enter">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xs">DF</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Dayflow</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to continue to your dashboard</p>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="jane@company.com" required className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign in →'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:text-indigo-600 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
