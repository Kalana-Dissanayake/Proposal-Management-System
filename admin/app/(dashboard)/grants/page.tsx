'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function GrantsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: '', description: '', fundingAmount: 0, fundingBody: '', researchArea: '', eligibility: '', deadline: '', status: 'open' });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/grants')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/grants/${editingId}` : '/api/admin/grants';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, fundingAmount: Number(formData.fundingAmount) })
    });

    if (res.ok) {
      setModalOpen(false);
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to save grant');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/grants/${deletingId}`, { method: 'DELETE' });
    fetchData();
  };

  const openEdit = (row: any) => {
    setFormData({
      title: row.title,
      description: row.description,
      fundingAmount: row.fundingAmount,
      fundingBody: row.fundingBody || '',
      researchArea: row.researchArea || '',
      eligibility: row.eligibility || '',
      deadline: row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : '',
      status: row.status
    });
    setEditingId(row._id);
    setModalOpen(true);
  };

  const openAdd = () => {
    setFormData({ title: '', description: '', fundingAmount: 0, fundingBody: '', researchArea: '', eligibility: '', deadline: '', status: 'open' });
    setEditingId(null);
    setModalOpen(true);
  };

  const columns = ['Title', 'Funding Body', 'Amount', 'Deadline', 'Status', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Grants</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Add Grant</button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        renderRow={(row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.fundingBody}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${row.fundingAmount?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.deadline).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button onClick={() => openEdit(row)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button onClick={() => { setDeletingId(row._id); setConfirmOpen(true); }} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Grant" : "Add Grant"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Funding Amount ($) *</label><input required type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.fundingAmount} onChange={e => setFormData({...formData, fundingAmount: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Funding Body</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.fundingBody} onChange={e => setFormData({...formData, fundingBody: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.researchArea} onChange={e => setFormData({...formData, researchArea: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label><input required type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium mt-4">Save</button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} message="Are you sure you want to delete this grant?" onConfirm={handleDelete} />
    </div>
  );
}
