'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ResearchersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', department: '', institution: '', researchAreas: '', bio: '', status: 'active' });

  const fetchData = (query = '') => {
    setLoading(true);
    fetch(`/api/admin/researchers?search=${query}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      researchAreas: formData.researchAreas.split(',').map(s => s.trim()).filter(Boolean)
    };

    const url = editingId ? `/api/admin/researchers/${editingId}` : '/api/admin/researchers';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setModalOpen(false);
    fetchData(search);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/researchers/${deletingId}`, { method: 'DELETE' });
    fetchData(search);
  };

  const openEdit = (row: any) => {
    setFormData({
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      department: row.department || '',
      institution: row.institution || '',
      researchAreas: row.researchAreas?.join(', ') || '',
      bio: row.bio || '',
      status: row.status || 'active'
    });
    setEditingId(row._id);
    setModalOpen(true);
  };

  const openAdd = () => {
    setFormData({ name: '', email: '', phone: '', department: '', institution: '', researchAreas: '', bio: '', status: 'active' });
    setEditingId(null);
    setModalOpen(true);
  };

  const columns = ['Name', 'Email', 'Department', 'Institution', 'Status', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Researchers</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Add Researcher</button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        renderRow={(row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.department}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.institution}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {row.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button onClick={() => openEdit(row)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button onClick={() => { setDeletingId(row._id); setConfirmOpen(true); }} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Researcher" : "Add Researcher"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Institution</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Research Areas (comma separated)</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.researchAreas} onChange={e => setFormData({...formData, researchAreas: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium mt-4">Save</button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} message="Are you sure you want to delete this researcher?" onConfirm={handleDelete} />
    </div>
  );
}
