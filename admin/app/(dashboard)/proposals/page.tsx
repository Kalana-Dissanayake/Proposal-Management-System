'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import Link from 'next/link';

export default function ProposalsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const [researchers, setResearchers] = useState<any[]>([]);
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [assigningProposalId, setAssigningProposalId] = useState<string | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState('');

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/admin/proposals?page=${page}&limit=10&status=${statusFilter}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData(d.data.proposals);
          setTotalPages(d.data.totalPages || 1);
        }
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const loadResearchers = () => {
    fetch('/api/admin/researchers')
      .then(res => res.json())
      .then(d => { if (d.success) setResearchers(d.data.filter((r: any) => r.status === 'active')); });
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/proposals/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const assignReviewer = async () => {
    if (!selectedReviewer || !assigningProposalId) return;
    await fetch(`/api/admin/proposals/${assigningProposalId}/assign-reviewer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewerId: selectedReviewer })
    });
    setAssignOpen(false);
    fetchData();
  };

  const columns = ['Title', 'Researcher', 'Email', 'Status', 'Submitted Date', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
        <select 
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        renderRow={(row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={row.title}>{row.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.researcherName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.researcherEmail}</td>
            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.submittedAt).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 flex items-center h-full">
              <Link href={`/proposals/${row._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
              {row.status === 'pending' && (
                <>
                  <button onClick={() => { updateStatus(row._id, 'approved'); }} className="text-green-600 hover:text-green-900">Approve</button>
                  <button onClick={() => { updateStatus(row._id, 'rejected'); }} className="text-red-600 hover:text-red-900">Reject</button>
                  <button onClick={() => { setAssigningProposalId(row._id); loadResearchers(); setAssignOpen(true); }} className="text-blue-600 hover:text-blue-900">Assign Reviewer</button>
                </>
              )}
            </td>
          </tr>
        )}
      />

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Previous</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Next</button>
      </div>

      <Modal isOpen={isAssignOpen} onClose={() => setAssignOpen(false)} title="Assign Reviewer">
        <div className="space-y-4 mt-2">
          <label className="block text-sm font-medium text-gray-700">Select Reviewer</label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={selectedReviewer}
            onChange={e => setSelectedReviewer(e.target.value)}
          >
            <option value="">-- Select --</option>
            {researchers.map(r => <option key={r._id} value={r._id}>{r.name} ({r.email})</option>)}
          </select>
          <button onClick={assignReviewer} disabled={!selectedReviewer} className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4 disabled:opacity-50 hover:bg-indigo-700">Assign</button>
        </div>
      </Modal>
    </div>
  );
}
