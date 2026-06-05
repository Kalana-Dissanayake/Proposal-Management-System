'use client';
import React, { useState } from 'react';
import {
  Users, FileText, Award, ClipboardCheck, Mail, BarChart2,
  Download, Filter, TableProperties,
} from 'lucide-react';

const inputCls = 'text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white';

interface ExportCard {
  key: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  formats: ('csv' | 'json')[];
  btnColor?: string;
}

const exportCards: ExportCard[] = [
  {
    key: 'researchers', icon: <Users size={16} />, iconBg: 'bg-purple-50 text-purple-600',
    title: 'Researchers', formats: ['csv', 'json'],
    description: 'Name, email, department, institution, research areas, and account status.',
  },
  {
    key: 'proposals', icon: <FileText size={16} />, iconBg: 'bg-blue-50 text-blue-600',
    title: 'Proposals', formats: ['csv', 'json'],
    description: 'Title, submitter details, budget, status, research area, and submission dates.',
  },
  {
    key: 'grants', icon: <Award size={16} />, iconBg: 'bg-teal-50 text-teal-600',
    title: 'Grants', formats: ['csv', 'json'],
    description: 'Title, funding body, amount, deadline, status, and research area.',
  },
  {
    key: 'reviews', icon: <ClipboardCheck size={16} />, iconBg: 'bg-amber-50 text-amber-600',
    title: 'Reviews', formats: ['csv', 'json'],
    description: 'Proposal title, reviewer, score, recommendation, and evaluation comments.',
  },
  {
    key: 'messages', icon: <Mail size={16} />, iconBg: 'bg-red-50 text-red-600',
    title: 'Messages', formats: ['csv', 'json'],
    description: 'Sender name, email, subject, message body, and submission date.',
  },
  {
    key: 'all', icon: <BarChart2 size={16} />, iconBg: 'bg-green-50 text-green-700',
    title: 'Full report', formats: ['json'],
    description: 'All collections combined into a single structured JSON export.',
    btnColor: 'bg-green-600 hover:bg-green-700',
  },
];

export default function ExportPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingExport, setLoadingExport] = useState<string | null>(null);

  const handleExport = async (collection: string, format: 'csv' | 'json') => {
    setLoadingExport(collection);
    try {
      const params = new URLSearchParams({
        collection,
        format,
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/export?${params.toString()}`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collection}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please try again.');
    } finally {
      setLoadingExport(null);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Export Data</h1>
        <p className="text-sm text-gray-400 mt-0.5">Download system records as CSV or JSON files</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
            <Filter size={15} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">Export filters</p>
            <p className="text-[11px] text-gray-400">Narrow the records included in your download</p>
          </div>
        </div>
        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] font-medium text-gray-700 mb-1.5">Date range</p>
            <p className="text-[11px] text-gray-400 mb-2">Filter records by creation date</p>
            <div className="flex items-center gap-2">
              <input type="date" className={inputCls} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <span className="text-gray-400 text-[12px]">to</span>
              <input type="date" className={inputCls} value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium text-gray-700 mb-1.5">Proposal status filter</p>
            <p className="text-[11px] text-gray-400 mb-2">Leave as &quot;All&quot; to export everything</p>
            <select className={`${inputCls} w-full`} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600">
            <TableProperties size={15} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">Available exports</p>
            <p className="text-[11px] text-gray-400">Choose a dataset and format to download</p>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportCards.map(card => (
            <div key={card.key} className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-col gap-2 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
                <p className="text-[12px] font-semibold text-gray-900">{card.title}</p>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{card.description}</p>
              <div className="flex items-center gap-1.5 mt-auto flex-wrap">
                {card.formats.map(f => (
                  <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 uppercase">
                    {f}
                  </span>
                ))}
                <div className="ml-auto flex gap-1.5">
                  {card.formats.map(format => (
                    <button
                      key={format}
                      onClick={() => handleExport(card.key, format)}
                      disabled={loadingExport === card.key}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-50 transition-colors ${card.btnColor || 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                      {loadingExport === card.key ? (
                        'Exporting...'
                      ) : (
                        <><Download size={11} /> {format.toUpperCase()}</>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
