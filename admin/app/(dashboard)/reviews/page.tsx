'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ReviewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isSubmitOpen, setSubmitOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [proposals, setProposals] = useState<any[]>([]);
  const [researchers, setResearchers] = useState<any[]>([]);
  
  const [assignData, setAssignData] = useState({ proposalId: '', reviewerId: '' });
  const [submitData, setSubmitData] = useState({ score: 5, comments: '', recommendation: 'approve' });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const loadAssignData = async () => {
    const [pRes, rRes] = await Promise.all([
      fetch('/api/admin/proposals?status=pending&limit=100').then(res => res.json()),
      fetch('/api/admin/researchers').then(res => res.json())
    ]);
    if (pRes.success) setProposals(pRes.data.proposals);
    if (rRes.success) setResearchers(rRes.data.filter((r: any) => r.status === 'active'));
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignData)
    });
    setAssignOpen(false);
    fetchData();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/admin/reviews/${submittingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });
    setSubmitOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/reviews/${deletingId}`, { method: 'DELETE' });
    fetchData();
  };

  const columns = ['Proposal', 'Reviewer', 'Score', 'Recommendation', 'Status', 'Date', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <button onClick={() => { loadAssignData(); setAssignOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Assign Review</button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        renderRow={(row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{row.proposalTitle || row.proposalId?.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reviewerName || row.reviewerId?.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{row.score ? `${row.score}/10` : '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{row.recommendation || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reviewedAt ? new Date(row.reviewedAt).toLocaleDateString() : '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              {row.status === 'pending' && (
                <button onClick={() => { setSubmittingId(row._id); setSubmitData({ score: 5, comments: '', recommendation: 'approve' }); setSubmitOpen(true); }} className="text-indigo-600 hover:text-indigo-900">Submit Review</button>
              )}
              <button onClick={() => { setDeletingId(row._id); setConfirmOpen(true); }} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isAssignOpen} onClose={() => setAssignOpen(false)} title="Assign Review">
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposal (Pending)</label>
            <select required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={assignData.proposalId} onChange={e => setAssignData({...assignData, proposalId: e.target.value})}>
              <option value="">-- Select --</option>
              {proposals.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
            <select required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={assignData.reviewerId} onChange={e => setAssignData({...assignData, reviewerId: e.target.value})}>
              <option value="">-- Select --</option>
              {researchers.map(r => <option key={r._id} value={r._id}>{r.name} ({r.email})</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium mt-4">Assign</button>
        </form>
      </Modal>

      <Modal isOpen={isSubmitOpen} onClose={() => setSubmitOpen(false)} title="Submit Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Score (1-10)</label><input required type="number" min="1" max="10" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={submitData.score} onChange={e => setSubmitData({...submitData, score: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Comments</label><textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32" value={submitData.comments} onChange={e => setSubmitData({...submitData, comments: e.target.value})} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
            <div className="space-x-4">
              <label><input type="radio" name="rec" value="approve" checked={submitData.recommendation === 'approve'} onChange={e => setSubmitData({...submitData, recommendation: e.target.value})} /> Approve</label>
              <label><input type="radio" name="rec" value="revise" checked={submitData.recommendation === 'revise'} onChange={e => setSubmitData({...submitData, recommendation: e.target.value})} /> Revise</label>
              <label><input type="radio" name="rec" value="reject" checked={submitData.recommendation === 'reject'} onChange={e => setSubmitData({...submitData, recommendation: e.target.value})} /> Reject</label>
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium mt-4">Submit</button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} message="Are you sure you want to delete this review?" onConfirm={handleDelete} />
    </div>
  );
}
