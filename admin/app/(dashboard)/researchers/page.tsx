'use client';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Researcher {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  institution?: string;
  researchAreas?: string[];
  bio?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  department: '',
  institution: '',
  researchAreas: '',
  bio: '',
  status: 'active',
};

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResearcher, setEditingResearcher] = useState<Researcher | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const fetchResearchers = (query = searchQuery) => {
    setLoading(true);
    fetch(`/api/admin/researchers?search=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setResearchers(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchResearchers(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openAdd = () => {
    setEditingResearcher(null);
    setForm(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (researcher: Researcher) => {
    setEditingResearcher(researcher);
    setForm({
      name: researcher.name,
      email: researcher.email,
      phone: researcher.phone || '',
      department: researcher.department || '',
      institution: researcher.institution || '',
      researchAreas: researcher.researchAreas?.join(', ') || '',
      bio: researcher.bio || '',
      status: researcher.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingResearcher
        ? `/api/admin/researchers/${editingResearcher._id}`
        : '/api/admin/researchers';
      const method = editingResearcher ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        closeModal();
        setForm(emptyForm);
        fetchResearchers();
      } else {
        setFormError(data.error || 'Failed to save researcher.');
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/researchers/${deletingId}`, { method: 'DELETE' });
    setDeletingId(null);
    fetchResearchers();
  };

  const columns = ['Name', 'Email', 'Department', 'Institution', 'Research Areas', 'Status', 'Actions'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Researchers</h1>
          <p className="text-gray-500 mt-1">Manage researcher profiles registered on the platform.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Add Researcher
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={researchers}
        loading={loading}
        renderRow={(row: Researcher, i: number) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.department || '—'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.institution || '—'}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px]">
              {row.researchAreas && row.researchAreas.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {row.researchAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              ) : '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button onClick={() => openEdit(row)} className="text-indigo-600 hover:text-indigo-900">
                Edit
              </button>
              <button
                onClick={() => { setDeletingId(row._id); setIsConfirmOpen(true); }}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingResearcher ? 'Edit Researcher' : 'Add Researcher'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.institution}
              onChange={e => setForm({ ...form, institution: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Areas</label>
            <input
              type="text"
              placeholder="e.g. AI, Machine Learning, Physics"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.researchAreas}
              onChange={e => setForm({ ...form, researchAreas: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple areas with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : editingResearcher ? 'Update Researcher' : 'Save Researcher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setDeletingId(null); }}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this researcher? This action cannot be undone."
      />
    </div>
  );
}
