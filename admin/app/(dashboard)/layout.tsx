import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 w-full max-w-7xl mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
