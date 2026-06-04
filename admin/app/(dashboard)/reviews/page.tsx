'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // New review modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [form, setForm] = useState({
    proposalId: '',
    reviewerId: '',
    score: '',
    comments: '',
    recommendation: 'revise',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReviews = () => {
    setLoading(true);
    fetch(`/api/admin/reviews?status=${statusFilter}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setReviews(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [statusFilter]);

  const openModal = () => {
    setFormError('');
    // Load proposals (under_review or pending) and active reviewers
    Promise.all([
      fetch('/api/admin/proposals?limit=100&page=1&status=all').then(r => r.json()),
      fetch('/api/admin/reviewers').then(r => r.json()),
    ]).then(([pRes, rRes]) => {
      if (pRes.success) setProposals(pRes.data.proposals.filter((p: any) => ['pending', 'under_review'].includes(p.status)));
      if (rRes.success) setReviewers(rRes.data.filter((r: any) => r.status === 'active'));
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          score: form.score ? Number(form.score) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setForm({ proposalId: '', reviewerId: '', score: '', comments: '', recommendation: 'revise' });
        fetchReviews();
      } else {
        setFormError(data.error || 'Failed to submit review');
      }
    } catch {
      setFormError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const recommendationColors: Record<string, string> = {
    approve: 'bg-green-100 text-green-700',
    reject: 'bg-red-100 text-red-700',
    revise: 'bg-yellow-100 text-yellow-700',
  };

  const columns = ['Proposal Title', 'Reviewer', 'Score', 'Recommendation', 'Status', 'Reviewed At'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
          </select>
          <button
            onClick={openModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Review
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        renderRow={(row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={row.proposalTitle}>
              {row.proposalTitle || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reviewerName || '—'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">
              {row.score !== undefined ? `${row.score}/100` : '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {row.recommendation ? (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${recommendationColors[row.recommendation] || 'bg-gray-100 text-gray-700'}`}>
                  {row.recommendation}
                </span>
              ) : '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(row.reviewedAt).toLocaleDateString()}
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Submit a Review">
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposal *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={form.proposalId}
              onChange={e => setForm({ ...form, proposalId: e.target.value })}
            >
              <option value="">-- Select Proposal --</option>
              {proposals.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={form.reviewerId}
              onChange={e => setForm({ ...form, reviewerId: e.target.value })}
            >
              <option value="">-- Select Reviewer --</option>
              {reviewers.map(r => (
                <option key={r._id} value={r._id}>{r.name} ({r.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score (1–100)</label>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={form.score}
              onChange={e => setForm({ ...form, score: e.target.value })}
              placeholder="e.g. 85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              value={form.recommendation}
              onChange={e => setForm({ ...form, recommendation: e.target.value })}
            >
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="revise">Revise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
              placeholder="Evaluation notes and feedback..."
            />
          </div>

          {formError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{formError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
