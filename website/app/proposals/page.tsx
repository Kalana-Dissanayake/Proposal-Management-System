'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProposalCard from '@/components/ProposalCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

function ProposalsList() {
  const searchParams = useSearchParams();
  const initialArea = searchParams.get('area') || 'all';

  const [proposals, setProposals] = useState<any[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [areaFilter, setAreaFilter] = useState(initialArea);

  useEffect(() => {
    api.get('/api/public/research-areas').then(res => {
      if (res.success) setAreas(res.data || res.areas); // res.areas from the API
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/public/proposals?area=${encodeURIComponent(areaFilter)}`)
      .then(res => {
        if (res.success) setProposals(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [areaFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Approved Proposals</h1>
          <p className="text-gray-600 text-lg">Explore previously funded research projects.</p>
        </div>
        <div className="w-full md:w-64 self-start">
          <select 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={areaFilter}
            onChange={e => setAreaFilter(e.target.value)}
          >
            <option value="all">All Research Areas</option>
            {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No approved proposals yet</h3>
          <p className="text-gray-500">Check back later for newly approved projects in this area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(p => <ProposalCard key={p._id} {...p} />)}
        </div>
      )}
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><LoadingSkeleton count={3} /></div>}>
      <ProposalsList />
    </Suspense>
  );
}
