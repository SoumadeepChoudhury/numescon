'use client';

import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Building2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenRegistration: () => void;
  onOpenPolicy: (type: 'terms' | 'integrity' | 'safety') => void;
}

export default function Footer({
  onNavigate,
  onOpenRegistration,
  onOpenPolicy,
}: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          
          {/* Brand & Mission (5 Cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-serif font-black text-xl shadow-xs shrink-0">
                N
              </div>
              <div>
                <span className="font-serif font-extrabold text-2xl text-white tracking-tight block leading-none">
                  NUMESCON 2026
                </span>
                <span className="text-xs text-slate-400 font-sans mt-1 block">
                  National Undergraduate Medical & Science Academic Fest
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
              National Undergraduate Medical, Science & Academic Fest. Organised and hosted by North Bengal Medical College & Hospital (NBMC&H), dedicated to advancing operative skills, clinical diagnostics, and student research.
            </p>

            <div className="flex items-center gap-2.5 text-sm text-slate-400 pt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>28th & 29th November 2026 · NBMC&H Auditorium</span>
            </div>
          </div>

          {/* Quick Nav (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-sm font-bold text-white uppercase tracking-wider block">
              Academic Fest
            </span>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('overview')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview & Themes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guest-lecture')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Guest Lecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('clusters')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Clusters (A–C)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('posters')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Event Posters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teaser')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Teaser Video
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  2-Day Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('committee')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  NBMC Committee
                </button>
              </li>
            </ul>
          </div>

          {/* Delegate Resources (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-sm font-bold text-white uppercase tracking-wider block">
              Delegates
            </span>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={onOpenRegistration}
                  className="hover:text-white text-amber-400 font-bold transition-colors cursor-pointer text-left"
                >
                  Workshop Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('clusters')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cluster Allocation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('archive')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Archival Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white text-slate-400 transition-colors cursor-pointer text-left"
                >
                  Registration Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Secretariat Contact (3 Cols - protected against overflow) */}
          <div className="md:col-span-3 space-y-4 min-w-0">
            <span className="text-sm font-bold text-white uppercase tracking-wider block">
              Host Secretariat
            </span>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <span className="leading-snug">
                  North Bengal Medical College & Hospital (NBMC&H), Sushrutanagar, Siliguri, Darjeeling District, West Bengal 734012
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a
                  href="mailto:secretariat@numescon2026.org"
                  className="font-mono text-xs sm:text-sm text-slate-300 hover:text-white break-all transition-colors"
                >
                  secretariat@numescon2026.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-slate-300">
                  Instagram: @numescon.26
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Policy Bottom Strip */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 North Bengal Medical College (NBMC) · NUMESCON Academic Fest.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400 text-xs sm:text-sm">
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer transition-colors"
            >
              Terms of Registration
            </button>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => onOpenPolicy('integrity')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer transition-colors"
            >
              Academic Integrity Code
            </button>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <button
              onClick={() => onOpenPolicy('safety')}
              className="hover:text-white underline-offset-4 hover:underline cursor-pointer transition-colors"
            >
              Campus Safety Protocol
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
