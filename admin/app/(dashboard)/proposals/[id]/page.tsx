'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/proposals/${params.id}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-64 bg-gray-200 rounded"></div></div>;
  if (!data) return <div>Proposal not found</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/proposals" className="text-indigo-600 hover:underline flex items-center gap-1 text-sm font-medium">
        &larr; Back to Proposals
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
          <StatusBadge status={data.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mt-8 text-sm">
          <div>
            <p className="text-gray-500 uppercase tracking-wide font-medium text-xs mb-1">Submitter</p>
            <p className="font-medium text-gray-900">{data.researcherName}</p>
            <p className="text-gray-500">{data.researcherEmail}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wide font-medium text-xs mb-1">Submission Details</p>
            <p className="font-medium text-gray-900">Area: {data.researchArea}</p>
            <p className="text-gray-500">Date: {new Date(data.submittedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wide font-medium text-xs mb-1">Financials & Duration</p>
            <p className="font-medium text-gray-900">Budget: ${data.budget?.toLocaleString()}</p>
            <p className="text-gray-500">Duration: {data.duration}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wide font-medium text-xs mb-1">Reviewer</p>
            <p className="font-medium text-gray-900">{data.assignedReviewerName || 'None assigned'}</p>
          </div>
        </div>

        <hr className="my-8 border-gray-100" />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Detailed Proposal</h3>
            {data.detailedProposalFile ? (
              <a href={`http://localhost:3000${data.detailedProposalFile}`} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                <span>Download Proposal Document</span>
              </a>
            ) : (
              <p className="text-gray-500 italic">No document attached.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
