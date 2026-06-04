import React from 'react';
import Link from 'next/link';

export default function ProposalCard({ _id, title, researcherName, researchArea, status, submittedAt }: any) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const css = map[status] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${css}`}>
          {status.replace('_', ' ')}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">By {researcherName}</p>
      
      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Area / Date</p>
          <p className="text-sm text-gray-700 font-medium">{researchArea}</p>
          <p className="text-xs text-gray-500">{new Date(submittedAt).toLocaleDateString()}</p>
        </div>
        <Link href={`/proposals/${_id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
