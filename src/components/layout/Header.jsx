import React from 'react';
import { Search, Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header({ title }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200/60">
          {currentDate}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Public Verification Link */}
        <Link
          to="/verify/token-sai-kumar-2026-v1"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200/60 rounded-lg hover:bg-brand-100 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Test Public Verification Page
        </Link>

        {/* System Notifications Badge */}
        <button
          title="Notifications"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
