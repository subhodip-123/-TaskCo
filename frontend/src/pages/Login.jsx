import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Welcome back</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Sign in to your account</p>
      </div>
      <div>
        <label className="label">Email</label>
        <div className="relative">
          <HiOutlineEnvelope className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            className="input pl-10"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <HiOutlineLockClosed className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            className="input pl-10"
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-sm text-center text-slate-500">
        New here?{' '}
        <Link to="/register" className="text-brand-600 font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
