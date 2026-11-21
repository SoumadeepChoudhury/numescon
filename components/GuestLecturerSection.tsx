'use client';

import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Award,
  Stethoscope,
  ArrowRight,
  DoorOpen,
  Sparkles,
} from 'lucide-react';

interface GuestLecturerSectionProps {
  onViewSchedule?: () => void;
  onViewClusters?: () => void;
}

export default function GuestLecturerSection({
  onViewSchedule,
  onViewClusters,
}: GuestLecturerSectionProps) {
  const credentials = [
    {
      label: 'Alma Mater',
      value: 'MBBS — Maulana Azad Medical College, New Delhi',
      icon: GraduationCap,
    },
    {
      label: 'Teaching Legacy',
      value: 'Over 15 years of postgraduate medical entrance mentorship',
      icon: Award,
    },
    {
      label: 'Authorship & Specialty',
      value: 'Renowned author and national educator in Internal Medicine',
      icon: BookOpen,
    },
    {
      label: 'Clinical Pedagogy',
      value: 'Celebrated for concept-based, clinically integrated medical teaching',
      icon: Stethoscope,
    },
  ];

  return (
    <section
      id="guest-lecture"
      className="relative py-24 sm:py-32 bg-[#0B1220] text-white border-b border-slate-800 overflow-hidden"
    >
      {/* Architectural ambient light accents */}
      <div className="absolute -top-32 right-0 w-[680px] h-[680px] bg-blue-900/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-24 w-[540px] h-[540px] bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Masthead Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10 mb-14 lg:mb-16">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-amber-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Distinguished Guest Lecture · NUMESCON × PLASMA 2026</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-mono tabular-nums">
            Saturday, 28 Nov 2026 · 2:00 PM – 3:00 PM · NBMC&amp;H Auditorium
          </div>
        </div>

        {/* Main 12-Column Curatorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Clean Studio Editorial Portrait (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Subtle Architectural Offset Border Frame */}
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -inset-3 rounded-[2rem] border border-amber-400/20 pointer-events-none"
              />

              <div className="relative rounded-3xl overflow-hidden bg-slate-900 ring-1 ring-white/15 shadow-2xl aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/dr_deepak_marwah_portrait.jpg"
                  alt="Portrait of Dr. Deepak Marwah — Academician, Clinician, and Internal Medicine Educator"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />

                {/* Smooth Lower Editorial Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/70 to-transparent pointer-events-none" />

                {/* Minimal Editorial Caption Plate */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="border-l-2 border-amber-400 pl-4">
                    <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300">
                      Keynote Speaker
                    </span>
                    <span className="block font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Dr. Deepak Marwah
                    </span>
                    <span className="block text-xs sm:text-sm text-slate-300 mt-0.5">
                      Internal Medicine · MBBS, MAMC New Delhi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Institutional Attribution beneath Portrait */}
            <div className="mt-6 flex items-center justify-between gap-4 px-1 text-xs text-slate-400">
              <span>Presented by North Bengal Medical College &amp; Hospital</span>
              <span className="font-mono text-amber-300/90 shrink-0">NUMESCON × PLASMA</span>
            </div>
          </div>

          {/* Right Column: Monograph Profile, Credentials & Session Logistics (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Heading & Discipline Line */}
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-sky-300 mb-3">
                North Bengal Medical College &amp; Hospital Presents
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06] text-balance">
                Dr. Deepak Marwah
              </h2>
              <p className="mt-4 text-lg sm:text-xl font-serif italic text-amber-300 tracking-wide">
                Academician &nbsp;&middot;&nbsp; Clinician &nbsp;&middot;&nbsp; Medical Educator
              </p>
            </div>

            {/* Pull Quote */}
            <blockquote className="py-6 border-y border-white/12">
              <p className="font-serif text-xl sm:text-2xl text-slate-100 leading-relaxed italic">
                &ldquo;An exceptional academic opportunity to learn, explore clinical concepts and gain insights from an acclaimed medical educator.&rdquo;
              </p>
            </blockquote>

            {/* Structured Credentials Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {credentials.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.label}
                    className="pt-4 border-t border-white/10 flex items-start gap-3.5"
                  >
                    <IconComponent className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {item.label}
                      </dt>
                      <dd className="text-sm sm:text-base text-slate-100 font-medium leading-snug">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            {/* Session Logistics Bar + Open Entry Notice */}
            <div className="bg-white/[0.04] border border-white/12 rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Date</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    28th November 2026
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Saturday · Day 1</div>
                </div>

                <div className="sm:border-l sm:border-white/10 sm:pl-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Session Timing</span>
                  </div>
                  <div className="text-base font-bold text-white tabular-nums">
                    2:00 PM – 3:00 PM
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Keynote Slot 06</div>
                </div>

                <div className="sm:border-l sm:border-white/10 sm:pl-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Venue</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    NBMC&amp;H Auditorium
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Sushrutanagar Campus</div>
                </div>
              </div>

              {/* Open Auditorium Notice — Explicitly No Registration Needed */}
              <div className="pt-4 border-t border-white/10 flex items-start sm:items-center gap-3 text-sm text-emerald-300">
                <DoorOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                <p className="leading-snug">
                  <strong className="text-white font-semibold">Open Auditorium Session — No Registration Required.</strong>{' '}
                  <span className="text-slate-300">
                    All guest lectures and scientific talks are open-entry; registration applies exclusively to hands-on workshop clusters.
                  </span>
                </p>
              </div>
            </div>

            {/* Clean Editorial Navigation Links (No Lecture Registration Button) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              {onViewSchedule && (
                <button
                  onClick={onViewSchedule}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-md transition-all cursor-pointer group whitespace-nowrap"
                >
                  <span>View Full Schedule</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {onViewClusters && (
                <button
                  onClick={onViewClusters}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Practical Workshops</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              )}
            </div>

            {/* Footer Collaboration Line */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <span>Organised under NUMESCON in collaboration with PLASMA 2026</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">@numescon.26</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">nbmcplasma@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
