'use client';
import React, { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-64 bg-gray-200 rounded"></div></div>;
  if (!data) return <div>Failed to load data</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const proposalsStatusData = data.proposalsByStatus.map((d: any) => ({ name: d._id, value: d.count }));
  const budgetAreaData = data.budgetByArea.map((d: any) => ({ name: d._id, budgetK: d.totalBudget / 1000 }));
  const proposalsMonthData = data.proposalsPerMonth.map((d: any) => ({ name: d._id, count: d.count }));

  const totalProposals = proposalsStatusData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const approved = proposalsStatusData.find((d: any) => d.name === 'approved')?.value || 0;
  const rejected = proposalsStatusData.find((d: any) => d.name === 'rejected')?.value || 0;
  const underReview = proposalsStatusData.find((d: any) => d.name === 'under_review')?.value || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Proposals" value={totalProposals} color="gray-900" />
        <StatCard title="Approved" value={approved} color="green-600" />
        <StatCard title="Rejected" value={rejected} color="red-600" />
        <StatCard title="Under Review" value={underReview} color="blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-gray-900">Proposals by Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={proposalsStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {proposalsStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-gray-900">Budget by Research Area ($K)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetAreaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budgetK" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-gray-900">Proposals Submitted per Month</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={proposalsMonthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-gray-900">Top Researchers (By Proposals)</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Proposals</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topResearchers.map((r: any, i: number) => (
                <tr key={r._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{i + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r._id || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-bold">{r.proposalCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
