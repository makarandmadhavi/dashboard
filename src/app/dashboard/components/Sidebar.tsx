'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 h-screen w-64 bg-[#0F172A] text-gray-200 shadow-lg flex flex-col">
      <div className="p-4 border-b border-slate-800">
        {/* Dashboard Branding */}
        <h2 className="text-2xl font-bold text-teal-400">Dashboard</h2>
        <p className="text-xs text-gray-400">AI Data Insights</p>
      </div>
      <nav className="flex flex-col space-y-2 p-4">
        <Link
          href="/dashboard/create-task"
          className={`px-3 py-2 rounded hover:bg-slate-800 ${
            pathname === '/dashboard/create-task' ? 'bg-slate-800' : ''
          }`}
        >
          Create Task
        </Link>
        <Link
          href="/dashboard/analytics"
          className={`px-3 py-2 rounded hover:bg-slate-800 ${
            pathname === '/dashboard/analytics' ? 'bg-slate-800' : ''
          }`}
        >
          Analytics
        </Link>
      </nav>
      <div className="mt-auto p-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Dashboard
      </div>
    </div>
  );
}
