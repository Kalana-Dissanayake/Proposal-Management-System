import React from 'react';

const statusStyles: Record<string, string> = {
  pending:      'bg-amber-50 text-amber-700 border border-amber-200',
  under_review: 'bg-blue-50 text-blue-700 border border-blue-200',
  approved:     'bg-green-50 text-green-700 border border-green-200',
  rejected:     'bg-red-50 text-red-700 border border-red-200',
  active:       'bg-green-50 text-green-700 border border-green-200',
  inactive:     'bg-gray-100 text-gray-500 border border-gray-200',
  open:         'bg-teal-50 text-teal-700 border border-teal-200',
  closed:       'bg-gray-100 text-gray-500 border border-gray-200',
  upcoming:     'bg-purple-50 text-purple-700 border border-purple-200',
  submitted:    'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-500 border border-gray-200';
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${style}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
