'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Menu, X, Ticket, ShieldCheck, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenRegistration: () => void;
  hasExistingPass?: boolean;
}

export default function Navbar({
  activeSection,
  onNavigate,
  onOpenRegistration,
  hasExistingPass,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'guest-lecture', label: 'Guest Lecture' },
    { id: 'clusters', label: 'Clusters (A–C)' },
    { id: 'posters', label: 'Posters' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'committee', label: 'Committee' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
          : 'bg-white/90 backdrop-blur-xs border-b border-slate-200/50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Mark */}
          <button
            onClick={() => handleLinkClick('overview')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 flex items-center justify-center text-white font-serif font-bold text-xl tracking-wider shadow-sm group-hover:bg-blue-900 transition-colors">
              N
            </div>
            <div>
              <span className="block font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-slate-950 leading-none">
                NUMESCON 2026
              </span>
              <span className="block text-xs font-sans text-slate-500 font-medium tracking-wide mt-1">
                Annual Academic Fest · NBMC
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-base font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1.5 transition-colors hover:text-slate-950 cursor-pointer ${
                    isActive ? 'text-blue-900 font-bold' : ''
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Group: Register Button + Hamburger Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenRegistration}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              {hasExistingPass ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>My Workshop Pass</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4 shrink-0" />
                  <span>Registration</span>
                </>
              )}
            </button>

            {/* Mobile & Tablet Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl focus:outline-hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen / Large Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 pb-6 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl transition-colors ${
                    activeSection === link.id
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegistration();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-base font-bold text-white bg-blue-900 rounded-xl shadow-sm"
              >
                <Ticket className="w-5 h-5" />
                <span>{hasExistingPass ? 'View My Workshop Pass' : 'Register for Workshops'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
