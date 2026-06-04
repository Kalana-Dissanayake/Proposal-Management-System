import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">GrantPortal</h2>
            <p className="text-gray-400 text-sm">Empowering research through transparent, accessible funding and peer review.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/grants" className="text-gray-400 hover:text-white transition-colors">View Grants</Link></li>
              <li><Link href="/submit-proposal" className="text-gray-400 hover:text-white transition-colors">Submit Proposal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Email: support@grantportal.edu</li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Form</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} GrantPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
