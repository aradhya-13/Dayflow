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
    if (name === 'password') setPwError(passwordRules.test(value) ? '' : 'Min 8 chars, 1 uppercase, 1 number, 1 special char');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRules.test(form.password)) { setPwError('Min 8 chars, 1 uppercase, 1 number, 1 special char'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/signup', form);
      signin(data.data.token, data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex auth-bg">
      {/* Left panel */}
      <div className="hidden lg:flex w-[44%] relative bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex-col justify-between p-14 text-white overflow-hidden shine">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-white font-black text-sm">DF</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">Dayflow</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-5 tracking-tight">
            Join your team<br />
            <span className="text-indigo-200">on Dayflow.</span>
          </h1>
          <p className="text-indigo-100/80 text-sm leading-relaxed mb-8">
            Create your account and start collaborating with your team instantly.
          </p>
          <div className="space-y-3">
            {[
              { icon: '⏱', text: 'Punch in & out from anywhere' },
              { icon: '📋', text: 'Apply for leave in seconds' },
              { icon: '💰', text: 'View payslips instantly' },
              { icon: '👥', text: 'Stay connected with your team' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {icon}
                </div>
                <p className="text-white/85 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300/60 text-xs relative z-10">© 2024 Dayflow HRMS</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg page-enter">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xs">DF</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">Dayflow</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Create account</h2>
          <p className="text-sm text-gray-500 mb-8">Fill in your details to get started</p>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {pwError
                ? <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1"><span>⚠</span> {pwError}</p>
                : form.password && <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1"><span>✓</span> Password looks good</p>
              }
            </div>
            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="employee">👤 Employee</option>
                <option value="admin">🛡️ HR / Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 font-semibold hover:text-indigo-600 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
