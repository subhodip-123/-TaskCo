import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBars3,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="sticky top-0 z-20 bg-white/75 dark:bg-[#0d0f14]/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center justify-between px-4 md:px-8 py-3.5">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
          onClick={onMenuClick}
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>

        <div className="hidden md:block">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-none">
            Good to have you back,
          </p>
          <h2 className="text-sm font-bold leading-tight mt-0.5">
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              {initials}
            </div>
            <span className="text-sm font-semibold">{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
            title="Logout"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
