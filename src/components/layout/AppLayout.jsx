import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ title = 'Dashboard', children }) {
  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-4 sm:p-5 md:p-6 w-full max-w-[1600px] mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
