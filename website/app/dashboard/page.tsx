'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/proposals')
      .then(r => r.json())
      .then(d => {
        if (d.success) setProposals(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
        <Link href="/submit-proposal" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Submit New Proposal</Link>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">You haven't submitted any proposals yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {proposals.map(p => (
            <Link key={p._id} href={`/dashboard/proposals/${p._id}`} className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">Submitted on: {new Date(p.submittedAt).toLocaleDateString()}</p>
                  <p className="text-gray-700">Budget: ${p.budget}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                      p.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
