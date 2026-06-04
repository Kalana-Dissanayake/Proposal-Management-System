'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ProposalDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/api/public/proposals/${params.id}`)
      .then(res => {
        if (res.success) setData(res.data);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Proposal not found</h1>
        <p className="text-gray-600 mb-8">The proposal you are looking for does not exist or has been removed.</p>
        <Link href="/proposals" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Back to Proposals
        </Link>
      </div>
    );
  }

  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };
  const css = map[data.status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/proposals" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-2 mb-8">
        &larr; Back to Proposals
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight flex-1">{data.title}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border ${css}`}>
              {data.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Principal Investigator</p>
              <p className="text-lg font-medium text-gray-900">{data.researcherName}</p>
              <p className="text-gray-600">{data.researcherEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Project Details</p>
              <p className="text-lg font-medium text-indigo-600">{data.researchArea}</p>
              <p className="text-gray-600">Submitted: {new Date(data.submittedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Financial Request</p>
              <p className="text-2xl font-bold text-gray-900">${data.budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Estimated Duration</p>
              <p className="text-lg font-medium text-gray-900">{data.duration || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Abstract</h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{data.abstract}</p>
          </section>

          {data.objectives && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Objectives</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{data.objectives}</p>
            </section>
          )}

          {data.methodology && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Methodology</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{data.methodology}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
