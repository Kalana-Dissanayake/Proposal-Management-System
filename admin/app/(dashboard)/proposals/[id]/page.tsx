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
            <p className="text-gray-500 uppercase tracking-wide font-medium text-xs mb-1">Researcher</p>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Abstract</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{data.abstract}</p>
          </div>
          {data.objectives && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Objectives</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{data.objectives}</p>
            </div>
          )}
          {data.methodology && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Methodology</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{data.methodology}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
