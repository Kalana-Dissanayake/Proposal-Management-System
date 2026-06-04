'use client';
import React, { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function MessagesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/admin/messages')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleRead = async (id: string, isRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!isRead) {
      await fetch(`/api/admin/messages/${id}/read`, { method: 'PUT' });
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/messages/${deletingId}`, { method: 'DELETE' });
    fetchData();
  };

  const unreadCount = data.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Messages
          {unreadCount > 0 && <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">{unreadCount} unread</span>}
        </h1>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl w-full"></div>)}
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">No messages found.</div>
      ) : (
        <div className="space-y-4">
          {data.map((msg) => (
            <div key={msg._id} className={`bg-white rounded-xl shadow-sm border ${msg.isRead ? 'border-gray-100' : 'border-l-4 border-l-indigo-600 border-t-gray-100 border-r-gray-100 border-b-gray-100'} overflow-hidden transition-all duration-200`}>
              <div 
                className="p-5 cursor-pointer flex justify-between items-start hover:bg-gray-50"
                onClick={() => handleRead(msg._id, msg.isRead)}
              >
                <div>
                  <h3 className={`text-lg ${msg.isRead ? 'text-gray-900 font-medium' : 'text-gray-900 font-bold'}`}>{msg.subject}</h3>
                  <p className="text-gray-600 text-sm mt-1">{msg.name} ({msg.email})</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm text-gray-500">{new Date(msg.submittedAt).toLocaleDateString()}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeletingId(msg._id); setConfirmOpen(true); }} 
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {expandedId === msg._id && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} message="Are you sure you want to delete this message?" onConfirm={handleDelete} />
    </div>
  );
}
