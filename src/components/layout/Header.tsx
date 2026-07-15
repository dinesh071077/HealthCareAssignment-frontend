import React from 'react';
import { Bell, Sun, Moon, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      {/* Left: page title */}
      <div>
        {title && <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>}
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm w-48">
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="text-slate-400 text-xs">Search...</span>
        </div>

        {/* Log Interaction CTA */}
        <button
          onClick={() => navigate('/log-interaction')}
          className="btn-primary text-xs px-3 py-2 hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4" />
          Log Interaction
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
            {user?.name.charAt(0) ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
