import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  History, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { logout, user } = useAuth();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Interns', path: '/interns', icon: Users, badge: '5 Active' },
    { label: 'Certificates', path: '/certificates', icon: Award, badge: '124 Issued' },
  ];

  const systemNav = [
    { label: 'Templates', path: '/templates', icon: FileText, badge: 'v1.2' },
    { label: 'Audit Logs', path: '/audit-logs', icon: History, badge: 'Live' },
  ];

  return (
    <aside className="w-72 bg-[#090D16] text-slate-200 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top Brand Workspace Card */}
        <div className="p-4 border-b border-slate-800/70">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-lg shadow-black/40 group hover:border-[#2C91E3]/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-[#2C91E3] rounded-xl blur-xs opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-slate-950 border border-[#2C91E3]/50 flex items-center justify-center p-1.5 shadow-md">
                  <img src="/favicon.png" alt="CertiFlow Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <div className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                  Certi<span className="text-[#2C91E3]">Flow</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Verification Engine
                  </span>
                </div>
              </div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Section 1: Main Navigation */}
        <div className="px-4 pt-5">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between">
            <span>Main Workspace</span>
            <Layers className="w-3 h-3 text-slate-600" />
          </div>
          <nav className="space-y-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2C91E3] to-[#1D70B8] text-white shadow-lg shadow-[#2C91E3]/25 border border-blue-400/30 translate-x-0.5'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:translate-x-1 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        {/* Glowing Active Bar */}
                        {isActive && (
                          <span className="absolute -left-1 w-1.5 h-6 bg-sky-300 rounded-r-full shadow-[0_0_10px_#38bdf8]"></span>
                        )}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-inner'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-[#2C91E3]/10 group-hover:border-[#2C91E3]/40 group-hover:text-[#2C91E3]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-[#2C91E3]/30 group-hover:text-[#2C91E3]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-600 opacity-40 group-hover:opacity-100 group-hover:text-slate-300'
                        }`} />
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Dribbble Style Floating Certificate Widget */}
        <div className="mx-4 my-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#14263D] border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#2C91E3]/15 blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black text-[#2C91E3] tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Quick Stats
            </span>
            <span className="text-[10px] font-bold text-slate-400">Quota 85%</span>
          </div>
          <div className="text-xs font-bold text-white mb-2">124 Issued Certificates</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-3">
            <div className="h-full rounded-full bg-gradient-to-r from-[#2C91E3] to-sky-400 w-[85%] shadow-[0_0_8px_#2C91E3]"></div>
          </div>
          <NavLink
            to="/interns"
            className="block text-center text-xs font-extrabold text-white bg-[#2C91E3]/20 hover:bg-[#2C91E3] border border-[#2C91E3]/40 py-2 rounded-xl transition-all duration-300 shadow-xs"
          >
            + Generate New Cert
          </NavLink>
        </div>

        {/* Section 2: System Management */}
        <div className="px-4">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between">
            <span>System Management</span>
            <ShieldCheck className="w-3 h-3 text-slate-600" />
          </div>
          <nav className="space-y-1.5">
            {systemNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2C91E3] to-[#1D70B8] text-white shadow-lg shadow-[#2C91E3]/25 border border-blue-400/30 translate-x-0.5'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:translate-x-1 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        {isActive && (
                          <span className="absolute -left-1 w-1.5 h-6 bg-sky-300 rounded-r-full shadow-[0_0_10px_#38bdf8]"></span>
                        )}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-inner'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-[#2C91E3]/10 group-hover:border-[#2C91E3]/40 group-hover:text-[#2C91E3]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-[#2C91E3]/30 group-hover:text-[#2C91E3]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-600 opacity-40 group-hover:opacity-100 group-hover:text-slate-300'
                        }`} />
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Sign Out Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl space-y-2.5">
        {/* User Card */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C91E3] to-[#1D70B8] text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-[#2C91E3]/30">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@certiflow.com'}</div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-extrabold text-rose-400 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-900/40 rounded-xl transition-all duration-300 border border-rose-900/30 hover:border-rose-800/60 active:scale-[0.98]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
