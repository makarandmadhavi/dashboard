'use client';
import React from 'react';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskProvider>
      {/* Dark gradient background for the entire dashboard */}
      <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#0F172A] flex text-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </TaskProvider>
  );
}
