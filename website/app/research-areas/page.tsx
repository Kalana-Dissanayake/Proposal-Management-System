'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ResearchAreasPage() {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/public/research-areas')
      .then(res => {
        if (res.success) setAreas(res.areas || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-10 bg-gray-200 rounded w-1/3 mb-10"></div><div className="grid grid-cols-3 gap-6"><div className="h-32 bg-gray-200 rounded-xl"></div><div className="h-32 bg-gray-200 rounded-xl"></div></div></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Areas</h1>
        <p className="text-xl text-gray-600">Explore the diverse fields of study currently being funded and researched through our platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {areas.map((area, index) => (
          <Link href={`/proposals?area=${encodeURIComponent(area)}`} key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{area}</h3>
            <p className="text-gray-500 font-medium text-sm flex items-center text-indigo-600 group-hover:text-indigo-700">
              View Approved Proposals &rarr;
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
