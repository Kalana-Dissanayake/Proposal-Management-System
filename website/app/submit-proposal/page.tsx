'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function SubmitProposalPage() {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    researcherName: '',
    researcherEmail: '',
    researchArea: '',
    abstract: '',
    objectives: '',
    methodology: '',
    budget: '',
    duration: ''
  });

  useEffect(() => {
    api.get('/api/public/research-areas').then(res => {
      if (res.success) setAreas(res.data || res.areas);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.abstract.length < 100) {
      setError('Abstract must be at least 100 characters long.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget)
      };

      const res = await api.post('/api/public/proposals', payload);
      
      if (res.success) {
        setSuccessId(res.proposalId);
        setFormData({ title: '', researcherName: '', researcherEmail: '', researchArea: '', abstract: '', objectives: '', methodology: '', budget: '', duration: '' });
      } else {
        setError(res.error || 'Failed to submit proposal');
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
          <button onClick={() => setSuccessId(null)} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Submit Another Proposal
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Investigator Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input required name="researcherName" value={formData.researcherName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Dr. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input required type="email" name="researcherEmail" value={formData.researcherEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="jane@university.edu" />
              </div>
            </div>
          </div>

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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Detailed Proposal</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Abstract * <span className="text-gray-400 font-normal">(min 100 chars)</span></label>
                <textarea required name="abstract" value={formData.abstract} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[150px]" placeholder="Provide a comprehensive summary of your research proposal..."></textarea>
                <p className="text-xs text-right text-gray-500 mt-1">{formData.abstract.length}/100 chars minimum</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Objectives</label>
                <textarea name="objectives" value={formData.objectives} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px]" placeholder="What are the specific goals of this research?"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Methodology</label>
                <textarea name="methodology" value={formData.methodology} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px]" placeholder="How will you conduct this research?"></textarea>
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
