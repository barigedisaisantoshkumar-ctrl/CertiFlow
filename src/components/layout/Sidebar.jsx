import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  History, 
  ShieldCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Interns', path: '/interns', icon: Users },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'Templates', path: '/templates', icon: FileText },
    { label: 'Audit Logs', path: '/audit-logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Company / Brand Header */}
        <div className="h-16 px-6 flex items-center border-b border-slate-100 gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/25">
            <img src="/favicon.png" alt="CertiFlow Logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="font-bold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1">
              Certi<span className="text-brand-500">Flow</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Certificate System
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 border border-brand-200/60 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@certiflow.com'}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
