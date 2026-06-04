import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    open: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
    upcoming: 'bg-purple-100 text-purple-700',
    submitted: 'bg-blue-100 text-blue-700',
  };

  const css = map[status] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${css}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
