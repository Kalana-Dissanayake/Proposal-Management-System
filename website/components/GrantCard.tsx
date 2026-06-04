import React from 'react';

export default function GrantCard({ title, fundingBody, fundingAmount, deadline, researchArea, status }: any) {
  const map: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
    upcoming: 'bg-purple-100 text-purple-700',
  };
  const css = map[status] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${css}`}>
          {status}
        </span>
      </div>
      
      <p className="text-sm font-medium text-indigo-600 mb-2">{researchArea}</p>
      <h3 className="text-xl font-bold text-gray-900 mb-2 pr-16 leading-tight">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-grow">{fundingBody}</p>
      
      <div className="flex justify-between items-center mt-auto bg-gray-50 rounded-lg p-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Amount</p>
          <p className="text-lg font-bold text-gray-900">${fundingAmount.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Deadline</p>
          <p className="text-sm font-medium text-gray-900">{new Date(deadline).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
