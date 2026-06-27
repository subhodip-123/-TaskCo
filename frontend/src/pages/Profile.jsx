import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/auth.service';
import { HiOutlineUser, HiOutlineLink, HiOutlineLockClosed } from 'react-icons/hi2';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, avatar: form.avatar };
      if (form.password) payload.password = form.password;
      const data = await authService.updateProfile(payload);
      updateUser(data);
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account details.</p>
        </div>
      </div>

      <div className="card p-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand-500/25">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h2 className="font-bold text-base">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <div className="relative">
              <HiOutlineUser className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input name="name" value={form.name} onChange={change} className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Avatar URL</label>
            <div className="relative">
              <HiOutlineLink className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                name="avatar"
                value={form.avatar}
                onChange={change}
                className="input pl-10"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="label">New password</label>
            <div className="relative">
              <HiOutlineLockClosed className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={change}
                className="input pl-10"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
