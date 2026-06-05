'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import {
  Users, FileText, Mail, BarChart2, Award, CalendarDays,
  TrendingUp, CheckCircle, Clock, AlertCircle, MessageSquare,
} from 'lucide-react';

function getInitials(name: string) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

interface StatCardProps {
  label: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
  accent: string;
  icon: React.ReactNode;
  trend?: string;
  trendStyle?: string;
}

function StatCard({ label, value, iconBg, iconColor, accent, icon, trend, trendStyle }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${trendStyle}`}>{trend}</span>
        )}
      </div>
      <p className="text-[26px] font-semibold text-gray-900 leading-none">{value ?? 0}</p>
      <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
      <div className={`h-[3px] rounded-full mt-3 ${accent}`} />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
      </div>
    </div>
  );

  if (!data) return <div>Failed to load data</div>;

  const statCards: StatCardProps[] = [
    {
      label: 'Total Researchers',
      value: data.totalResearchers,
      iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
      accent: 'bg-purple-600',
      icon: <Users size={18} />,
    },
    {
      label: 'Total Proposals',
      value: data.totalProposals,
      iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      accent: 'bg-blue-600',
      icon: <FileText size={18} />,
    },
    {
      label: 'Total Grants',
      value: data.totalGrants,
      iconBg: 'bg-teal-50', iconColor: 'text-teal-600',
      accent: 'bg-teal-600',
      icon: <Award size={18} />,
    },
    {
      label: 'Unread Messages',
      value: data.unreadMessages,
      iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      accent: 'bg-amber-600',
      icon: <Mail size={18} />,
    },
    {
      label: 'Pending Proposals',
      value: data.pendingProposals,
      iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      accent: 'bg-amber-600',
      icon: <Clock size={18} />,
      trend: 'Awaiting', trendStyle: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Under Review',
      value: data.underReviewProposals,
      iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      accent: 'bg-blue-600',
      icon: <TrendingUp size={18} />,
      trend: 'In progress', trendStyle: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Approved Proposals',
      value: data.approvedProposals,
      iconBg: 'bg-green-50', iconColor: 'text-green-700',
      accent: 'bg-green-700',
      icon: <CheckCircle size={18} />,
      trend: 'Funded', trendStyle: 'bg-green-50 text-green-700',
    },
    {
      label: 'Open Grants',
      value: data.openGrants,
      iconBg: 'bg-red-50', iconColor: 'text-red-600',
      accent: 'bg-red-600',
      icon: <AlertCircle size={18} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back — here&apos;s what&apos;s happening today</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
          <CalendarDays size={14} className="text-gray-400" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => <StatCard key={i} {...card} />)}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <h3 className="text-[14px] font-semibold text-gray-900">Recent proposals</h3>
            </div>
            <Link href="/proposals" className="text-[12px] text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-0.5">
            {data.recentProposals.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[11px] font-semibold text-purple-600 flex-shrink-0">
                  {getInitials(p.researcherName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.researcherName}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              <h3 className="text-[14px] font-semibold text-gray-900">Recent messages</h3>
            </div>
            <Link href="/messages" className="text-[12px] text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-0.5">
            {data.recentMessages.map((m: any) => (
              <div key={m._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[11px] font-semibold text-blue-600 flex-shrink-0">
                  {getInitials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-900 truncate">{m.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{m.subject}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-400">
                    {new Date(m.submittedAt).toLocaleDateString()}
                  </span>
                  {!m.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
