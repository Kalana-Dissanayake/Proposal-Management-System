'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCheck, FileText, Award,
  ClipboardCheck, BarChart2, Mail, Download, Settings,
  LogOut, ChartNoAxesColumn,
} from 'lucide-react';

const navSections = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Researchers', path: '/researchers', icon: Users },
      { name: 'Reviewers',   path: '/reviewers',   icon: UserCheck },
      { name: 'Proposals',   path: '/proposals',   icon: FileText },
      { name: 'Grants',      path: '/grants',      icon: Award },
      { name: 'Reviews',     path: '/reviews',     icon: ClipboardCheck },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Reports',  path: '/reports',  icon: BarChart2 },
      { name: 'Messages', path: '/messages', icon: Mail, badge: true },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Export Data', path: '/export',   icon: Download },
      { name: 'Settings',    path: '/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => { if (d.success) setUnreadCount(d.data.unreadMessages); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-[220px] min-h-screen bg-[#1e1b4b] flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <ChartNoAxesColumn size={16} className="text-white" />
        </div>
        <span className="text-white font-semibold text-[15px] tracking-tight">GrantAdmin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navSections.map(section => (
          <div key={section.label} className="mb-1">
            <p className="px-4 pt-3 pb-1 text-[10px] text-white/35 uppercase tracking-widest font-medium">
              {section.label}
            </p>
            {section.items.map(item => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-[13px] transition-colors ${
                    active
                      ? 'bg-indigo-500/30 text-white font-medium'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 p-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-medium truncate">Super Admin</p>
            <p className="text-white/40 text-[10px] truncate">admin@admin.com</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-white/40 hover:text-red-400 transition-colors p-1"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
