import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  History, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { logout, user } = useAuth();
  
  // Persist sidebar collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('certiflow_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('certiflow_sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Interns', path: '/interns', icon: Users },
    { label: 'Certificates', path: '/certificates', icon: Award },
    { label: 'Templates', path: '/templates', icon: FileText },
    { label: 'Audit Logs', path: '/audit-logs', icon: History },
  ];

  return (
    <aside
      className={`relative bg-slate-950 text-slate-100 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-2xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Floating Toggle Button on Border */}
      <button
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand Sidebar (Open)" : "Collapse Sidebar (Close)"}
        className="absolute -right-3.5 top-7 z-40 w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-400 text-white border-2 border-slate-950 flex items-center justify-center shadow-lg shadow-brand-500/40 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div>
        {/* Top Brand Header */}
        <div className={`h-20 flex items-center border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-brand-400 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-brand-500/40 flex items-center justify-center p-1.5 shadow-lg">
                <img src="/favicon.png" alt="CertiFlow Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <div className="font-extrabold text-xl text-white tracking-tight leading-none flex items-center gap-1">
                  Certi<span className="text-brand-400 font-black">Flow</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1 flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5 text-brand-400" /> Certificate System
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest transition-all duration-300">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 border border-brand-400/40'
                      : 'text-slate-400 hover:bg-slate-900/90 hover:text-white border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3.5">
                      <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                      }`} />
                      
                      {!isCollapsed && (
                        <span className="whitespace-nowrap transition-all duration-300">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                        isActive ? 'text-white opacity-100 translate-x-0.5' : 'text-slate-600 opacity-40 group-hover:opacity-80 group-hover:text-slate-300'
                      }`} />
                    )}

                    {/* Tooltip on Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg border border-slate-700 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout Block */}
      <div className={`p-3 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md space-y-2.5 transition-all duration-300`}>
        {/* User Avatar / Profile Card */}
        <div
          title={isCollapsed ? `${user?.name || 'Admin'} (${user?.email || ''})` : undefined}
          className={`flex items-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30 flex items-center justify-center text-sm shadow-xs shrink-0">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@certiflow.com'}</div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/50 rounded-xl transition-all duration-200 border border-rose-900/40 hover:border-rose-800/60 active:scale-[0.98] ${
            isCollapsed ? 'justify-center p-2.5' : 'justify-center gap-2 px-3 py-2.5'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
