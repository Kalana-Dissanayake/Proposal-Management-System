'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import GrantCard from '@/components/GrantCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [grants, setGrants] = useState<any[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/public/stats'),
      api.get('/api/public/grants?limit=3'),
      api.get('/api/public/research-areas')
    ]).then(([sRes, gRes, aRes]) => {
      if (sRes.success) setStats({
        totalProposals: sRes.totalProposals,
        totalGrants: sRes.totalGrants,
        totalResearchers: sRes.totalResearchers
      });
      if (gRes.success) setGrants(gRes.data);
      if (aRes.success) setAreas(aRes.areas);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering the Future of Research</h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-3xl mx-auto">
            Discover funding opportunities, submit proposals, and collaborate with leading experts in your field.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/submit-proposal" className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">Submit a Proposal</Link>
            <Link href="/grants" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-900 transition-colors">View Grants</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">{stats ? stats.totalProposals : '-'}</p>
              <p className="text-indigo-200 uppercase tracking-wide text-sm mt-2">Proposals Submitted</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{stats ? stats.totalGrants : '-'}</p>
              <p className="text-indigo-200 uppercase tracking-wide text-sm mt-2">Active Grants</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{stats ? stats.totalResearchers : '-'}</p>
              <p className="text-indigo-200 uppercase tracking-wide text-sm mt-2">Registered Researchers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grants */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Grants</h2>
            <p className="text-gray-600 mt-2">Explore the latest funding opportunities available.</p>
          </div>
          <Link href="/grants" className="text-indigo-600 font-medium hover:underline hidden sm:block">View All Grants &rarr;</Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grants.map(g => <GrantCard key={g._id} {...g} />)}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Submit Proposal</h3>
              <p className="text-gray-600">Provide detailed information about your research project, budget, and methodology.</p>
            </div>
            <div>
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Review</h3>
              <p className="text-gray-600">Your proposal will be assigned to domain experts who will evaluate its scientific merit.</p>
            </div>
            <div>
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Funding Decision</h3>
              <p className="text-gray-600">Based on the review scores, the administration will make the final funding decision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Research Areas</h2>
        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><LoadingSkeleton count={4} /></div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {areas.map((area, i) => (
              <Link key={i} href={`/proposals?area=${encodeURIComponent(area)}`} className="bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-full hover:border-indigo-600 hover:text-indigo-600 transition-colors font-medium shadow-sm">
                {area}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
