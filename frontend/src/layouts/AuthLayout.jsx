import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

const features = [
  'Organize tasks with priority & categories',
  'Track progress with beautiful analytics',
  'Real-time updates across all devices',
];

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex dark:bg-[#0d0f14]">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-56 h-56 rounded-full bg-violet-500/10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white text-xl shadow-sm">
              T
            </div>
            <span className="font-bold text-white text-xl tracking-tight">Tasker</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Get more done,<br />stress less.
          </h1>
          <p className="text-brand-200 text-base leading-relaxed mb-10 max-w-xs">
            Your personal productivity hub — organized, focused, and always in sync.
          </p>
          <div className="space-y-3.5">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <HiOutlineCheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0" />
                <span className="text-brand-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-brand-500/80 text-xs">
          © 2025 Tasker — Stay focused. Get things done.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#0d0f14]">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xl font-bold mb-3 shadow-lg shadow-brand-500/30">
              T
            </div>
            <h1 className="text-2xl font-bold">Tasker</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stay focused. Get things done.
            </p>
          </div>

          <div className="card p-8 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/50">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
