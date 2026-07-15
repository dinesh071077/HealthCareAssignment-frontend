import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  BarChart3,
  Settings,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/doctors',      icon: UserRound,        label: 'Doctors'      },
  { to: '/interactions', icon: ClipboardList,    label: 'Interactions' },
  { to: '/analytics',    icon: BarChart3,        label: 'Analytics'    },
  { to: '/settings',     icon: Settings,         label: 'Settings'     },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <aside
      className={`
        flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        ${open ? 'w-60' : 'w-16'}
      `}
    >
      {/* ── Header: logo + toggle (always at top) ── */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        {/* Logo icon always visible */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          {open && (
            <span className="font-bold text-slate-800 dark:text-white text-sm leading-tight whitespace-nowrap">
              PharmaRep<br />
              <span className="text-brand-500 font-semibold text-xs">CRM Pro</span>
            </span>
          )}
        </div>

        {/* Toggle button — always in the top header */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open
            ? <ChevronLeft  className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          }
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <span
                className={isActive ? 'sidebar-item-active' : 'sidebar-item'}
                title={!open ? label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span className="truncate">{label}</span>}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
