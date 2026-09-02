import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ title = 'Dashboard', children }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        <Header title={title} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
