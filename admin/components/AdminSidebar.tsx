'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => {
        if (d.success) setUnreadCount(d.data.unreadMessages);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Reviewers', path: '/reviewers' },
    { name: 'Proposals', path: '/proposals' },
    { name: 'Grants', path: '/grants' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Reports', path: '/reports' },
    { name: 'Messages', path: '/messages', badge: unreadCount },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">GrantAdmin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map(link => {
          const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
          return (
            <Link key={link.path} href={link.path} className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-800 text-white font-medium' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
              <span>{link.name}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{link.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-indigo-800">
        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}
