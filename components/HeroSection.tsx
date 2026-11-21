'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Award, ArrowRight, Play, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onTeaserClick: () => void;
}

export default function HeroSection({
  onRegisterClick,
  onTeaserClick,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Exact festival date: November 28, 2026 at 10:00 AM
    const targetDate = new Date('2026-11-28T10:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200">
      {/* Ambient subtle light glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-100/60 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Official Kicker (Clean unboxed editorial metadata) */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-900 mb-7">
            <span>NUMESCON 2026</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-emerald-800">In Collaboration with PLASMA 2026</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
            <span className="text-slate-600">North Bengal Medical College &amp; Hospital</span>
          </div>

          {/* Grand Headline with High Legibility */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1] mb-8 text-balance">
            Annual Medical Academic Fest 2026
          </h1>

          {/* Subtitle with Generous Font Size */}
          <p className="text-lg sm:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto mb-12 text-balance">
            A premier 2-day hands-on medical festival hosted at NBMC&amp;H Auditorium, Sushrutanagar. Experience Keynote Guest Lecture by Dr. Deepak Marwah, scientific symposia, and 3 curated workshop clusters across both days.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-16">
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>Register for Workshops</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onTeaserClick}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base sm:text-lg font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>Watch Teaser Video</span>
            </button>
          </div>

          {/* High-Impact Countdown & Stats Strip */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
              {/* Stat 1 */}
              <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 md:py-2">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-950 tabular-nums leading-tight">
                  {timeLeft.days}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-2 block">
                  Days to Fest
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 md:py-2">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-950 tabular-nums leading-tight whitespace-nowrap">
                  2 Days
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-2 block">
                  28th &amp; 29th Nov 2026
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 md:py-2">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-blue-900 tabular-nums leading-tight whitespace-nowrap">
                  3 Clusters
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-2 block">
                  Dopamine Drive · Adrenaline Rush · Serotonin Surge
                </span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 md:py-2">
                <span className="pl-4 block text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-emerald-800 tabular-nums leading-tight whitespace-nowrap">
                  10+ Modules
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-2 block">
                  3 Workshops Each Day
                </span>
              </div>
            </div>

            {/* Quick Context Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-sm text-slate-600 font-medium">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-blue-900" />
                <span>November 28 &amp; 29, 2026 (Saturday &amp; Sunday)</span>
              </span>
              <span className="hidden xl:inline text-slate-300">·</span>
              <span className="inline-flex items-center gap-2">
                <Building2 className="w-4 h-4 shrink-0 text-blue-900" />
                <span>NBMC&amp;H Auditorium, North Bengal Medical College &amp; Hospital</span>
              </span>
              <span className="hidden xl:inline text-slate-300">·</span>
              <span className="inline-flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>Open Lectures · Registration for Workshops Only</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
