'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import GrantCard from '@/components/GrantCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function GrantsPage() {
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/public/grants?status=${filter}`)
      .then(res => {
        if (res.success) setGrants(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Funding Opportunities</h1>
          <p className="text-gray-600 text-lg">Browse currently available and upcoming research grants.</p>
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm self-start">
          {['all', 'open', 'upcoming', 'closed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      ) : grants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No grants available</h3>
          <p className="text-gray-500">There are no grants matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grants.map(g => <GrantCard key={g._id} {...g} />)}
        </div>
      )}
    </div>
  );
}
