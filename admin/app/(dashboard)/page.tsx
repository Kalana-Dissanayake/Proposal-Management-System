'use client';
import React, { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

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

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 rounded"></div></div></div>;
  if (!data) return <div>Failed to load data</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Researchers" value={data.totalResearchers} color="indigo-600" />
        <StatCard title="Total Proposals" value={data.totalProposals} color="blue-600" />
        <StatCard title="Total Grants" value={data.totalGrants} color="purple-600" />
        <StatCard title="Unread Messages" value={data.unreadMessages} color="red-500" />
        
        <StatCard title="Pending Proposals" value={data.pendingProposals} color="yellow-600" />
        <StatCard title="Under Review" value={data.underReviewProposals} color="blue-500" />
        <StatCard title="Approved Proposals" value={data.approvedProposals} color="green-600" />
        <StatCard title="Open Grants" value={data.openGrants} color="green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Proposals</h2>
            <Link href="/proposals" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data.recentProposals.map((p: any) => (
              <div key={p._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-500">{p.researcherName}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Messages</h2>
            <Link href="/messages" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data.recentMessages.map((m: any) => (
              <div key={m._id} className="p-3 hover:bg-gray-50 rounded-lg border border-gray-50">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <span className="text-xs text-gray-500">{new Date(m.submittedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1">{m.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
