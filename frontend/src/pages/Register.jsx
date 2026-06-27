import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Create your account</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Start organizing your tasks</p>
      </div>
      <div>
        <label className="label">Name</label>
        <div className="relative">
          <HiOutlineUser className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            name="name"
            value={form.name}
            onChange={change}
            className="input pl-10"
            placeholder="Your full name"
          />
        </div>
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
        {loading ? 'Creating...' : 'Create account'}
      </button>
      <p className="text-sm text-center text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
