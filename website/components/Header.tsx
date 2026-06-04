'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Grants', path: '/grants' },
    { name: 'Research Areas', path: '/research-areas' },
    { name: 'Proposals', path: '/proposals' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-700">GrantPortal</Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link key={link.path} href={link.path} className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-indigo-600 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/submit-proposal" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Submit Proposal</Link>
            {session ? (
              <>
                <span className="text-gray-700 font-medium mr-4">Welcome, {session.user?.name}</span>
                <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 font-medium">Dashboard</Link>
                <button onClick={() => signOut()} className="text-gray-500 hover:text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">Sign In</Link>
            )}
          </div>
          <div className="flex md:hidden">
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link key={link.path} href={link.path} onClick={() => setMenuOpen(false)} className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
                  {link.name}
                </Link>
              );
            })}
            <Link href="/submit-proposal" onClick={() => setMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50">Submit Proposal</Link>
            {session ? (
              <>
                <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-700 bg-gray-50 border-t border-b border-gray-100">Welcome, {session.user?.name}</div>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50">Dashboard</Link>
                <button onClick={() => signOut()} className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
