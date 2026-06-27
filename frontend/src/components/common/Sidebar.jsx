import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineXMark,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/tasks', label: 'All Tasks', icon: HiOutlineClipboardDocumentList },
  { to: '/tasks/new', label: 'New Task', icon: HiOutlinePlus },
  { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-[#0d0f14] border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-500/30">
              T
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Tasker</span>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-none mt-0.5">Productivity Suite</p>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            onClick={onClose}
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3.5 mb-3">
            Main Menu
          </p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer hint */}
        <div className="px-4 py-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50/50 dark:from-brand-600/10 dark:to-indigo-600/5 border border-brand-100/60 dark:border-brand-500/10">
            <HiOutlineSparkles className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Stay focused, ship daily.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
