'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProposalDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/proposals/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setProposal(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;
    setDeleting(true);
    const res = await fetch(`/api/proposals/${params.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading details...</div>;
  if (!proposal) return <div>Proposal not found</div>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">&larr; Back to Dashboard</Link>
        {proposal.status === 'pending' && (
          <button onClick={handleDelete} disabled={deleting} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete Proposal'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
              ${proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                proposal.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'}`}>
              {proposal.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Research Area</p>
              <p className="text-gray-900 font-medium">{proposal.researchArea || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Budget</p>
              <p className="text-gray-900 font-medium">${proposal.budget}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-gray-900 font-medium">{proposal.duration || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Submitted On</p>
              <p className="text-gray-900 font-medium">{new Date(proposal.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Attached Document</h2>
          <a href={proposal.detailedProposalFile} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            <span>View Proposal Document</span>
          </a>
        </div>

        {(proposal.assignedReviewerName || proposal.score || proposal.comments) && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Feedback</h2>
            
            <div className="space-y-6">
              {proposal.assignedReviewerName && (
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned Reviewer</p>
                  <p className="text-gray-900">{proposal.assignedReviewerName}</p>
                </div>
              )}
              
              {proposal.score !== undefined && (
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Evaluation Score</p>
                  <p className="text-2xl font-bold text-indigo-700">{proposal.score}/100</p>
                </div>
              )}

              {proposal.comments && (
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Reviewer Comments</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{proposal.comments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
