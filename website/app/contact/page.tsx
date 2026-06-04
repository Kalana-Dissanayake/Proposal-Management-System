'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';

export default function ContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  // Auto-fill name and email when the user is signed in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/api/public/contact', formData);
      if (res.success) {
        setStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' });
        // Keep name and email, clear only subject and message
        setFormData(prev => ({ ...prev, subject: '', message: '' }));
      } else {
        setStatus({ type: 'error', msg: res.error || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!session?.user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">Have questions about a grant or your proposal? Reach out to our support team.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 md:p-10">
        {status && (
          <div className={`p-4 rounded-xl mb-8 border ${status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Name *
                {isLoggedIn && <span className="ml-2 text-xs text-indigo-500 font-normal">(auto-filled)</span>}
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                readOnly={isLoggedIn}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${isLoggedIn ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
                {isLoggedIn && <span className="ml-2 text-xs text-indigo-500 font-normal">(auto-filled)</span>}
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                readOnly={isLoggedIn}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${isLoggedIn ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Question about my proposal status"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
            <textarea
              required
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[150px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading && <span className="animate-spin text-xl leading-none">⟳</span>}
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
