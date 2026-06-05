'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

function getInitials(name?: string | null) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const name = session?.user?.name ?? '';
  const email = session?.user?.email ?? '';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 group focus:outline-none"
        aria-label="User menu"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:bg-indigo-700 transition-colors">
          {getInitials(name)}
        </div>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
          </div>
          {/* Actions */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* Grid icon */}
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              My Dashboard
            </Link>
            <Link
              href="/submit-proposal"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* Document icon */}
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Submit Proposal
            </Link>
          </div>
          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              {/* Logout icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const links = [
    { name: 'Home',            path: '/' },
    { name: 'About',           path: '/about' },
    { name: 'Grants',          path: '/grants' },
    { name: 'Research Areas',  path: '/research-areas' },
    { name: 'Proposals',       path: '/proposals' },
    { name: 'Contact',         path: '/contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Brand — fixed width so it never shrinks */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-700">GrantPortal</Link>
          </div>

          {/* Nav links — allow shrinking but hide overflow gracefully */}
          <nav className="hidden md:flex items-center gap-6 flex-1 min-w-0">
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`whitespace-nowrap text-sm font-medium border-b-2 pb-0.5 transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right section — fixed, never grows or squeezes nav */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
            {session ? (
              /* Logged in: just show avatar dropdown — no text in the bar */
              <UserMenu session={session} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/submit-proposal"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Submit Proposal
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <div className="flex md:hidden ml-auto">
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {session ? (
              <>
                {/* Mobile user card */}
                <div className="mx-3 my-2 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(session.user?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  My Dashboard
                </Link>
                <Link
                  href="/submit-proposal"
                  onClick={() => setMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Submit Proposal
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/submit-proposal"
                  onClick={() => setMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Submit Proposal
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
