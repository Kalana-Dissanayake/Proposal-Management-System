'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SubmitProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    researchArea: '',
    budget: '',
    duration: ''
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // We can still fetch research areas from the public API or admin API
    fetch('/api/public/research-areas').then(res => res.json()).then(res => {
      if (res.success) setAreas(res.data || res.areas || []);
    }).catch(() => {});
  }, []);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!session) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Please attach a detailed proposal file.');
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('budget', formData.budget);
    payload.append('duration', formData.duration);
    payload.append('researchArea', formData.researchArea);
    payload.append('detailedProposalFile', file);

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        body: payload, // FormData automatically sets multipart/form-data
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccessId(data.proposalId);
      } else {
        setError(data.error || 'Failed to submit proposal');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Submission Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">Thank you for submitting your research proposal.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 inline-block text-left">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Your Proposal ID</p>
          <p className="text-2xl font-mono font-bold text-indigo-700">{successId}</p>
        </div>
        <div>
          <button onClick={() => { setSuccessId(null); setFile(null); setFormData({ title: '', researchArea: '', budget: '', duration: '' }); router.push('/dashboard'); }} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-indigo-900 py-16 text-center text-white mb-10">
        <h1 className="text-4xl font-bold mb-4">Submit a Proposal</h1>
        <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Complete the form below to apply for research funding. Our expert panel reviews all submissions carefully.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Project Overview</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="A Novel Approach to..." />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Research Area</label>
                  <select name="researchArea" value={formData.researchArea} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                    <option value="">-- Select Area --</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Duration</label>
                  <input name="duration" value={formData.duration} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. 12 months" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Budget Requested ($) *</label>
                <input required type="number" min="1" name="budget" value={formData.budget} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="50000" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Detailed Proposal Attachment</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Proposal Document (PDF or Word, max 5MB) *</label>
                <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 shadow-sm flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <span className="animate-spin mr-3 text-2xl leading-none">⟳</span> : null}
              Submit Final Proposal
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">By submitting, you agree to our terms and conditions regarding research funding.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
