import React, { useState, useEffect } from 'react';
import { Calendar, Bell, ChevronRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import HeartbeatVisualizer from './HeartbeatVisualizer.tsx';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenCalendar: () => void;
  onOpenNextJsCode: () => void;
}

export default function Hero({
  onOpenRegister,
  onOpenCalendar,
  onOpenNextJsCode,
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Tentative target: 1st December 2026, 09:00 AM UTC
    const targetDate = new Date('2026-12-01T09:00:00Z').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden medical-subtle-glow">
      {/* Background delicate medical wave pattern */}
      <div className="absolute inset-0 medical-grid-pattern opacity-40 pointer-events-none" />

      {/* Subtle organic decorative medical halo */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#2D6A5F]/8 via-[#4A8E81]/5 to-transparent rounded-full blur-3xl pointer-events-none" 
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Unboxed Metadata & Heartbeat Audio */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#4E7068]">
            <span className="font-semibold text-[#25574D] uppercase tracking-wider text-[11px]">
              Advance Announcement
            </span>
            <span aria-hidden="true">·</span>
            <span>National Medical Sciences Congress</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#356158]">Winter 2026</span>
          </div>

          <HeartbeatVisualizer />
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="max-w-4xl">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-[#11332C] leading-[1.08] mb-6 text-balance">
            NUMESCON 2026 is Coming.
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-[#2F5F55] mb-6 font-normal">
            Where Clinical Precision Meets Humane Compassion.
          </p>

          <p className="text-base sm:text-lg text-[#476861] max-w-2xl leading-relaxed mb-10">
            The flagship academic congregation uniting clinicians, postgraduates, surgical residents, and medical researchers. An advance preview of our biennial clinical case symposia, operative roundtables, and translational research forums.
          </p>
        </div>

        {/* Tentative Dates Marquee & Real-time Countdown Box */}
        <div id="dates" className="my-10 bg-white/95 rounded-3xl border border-[#D3E3DD] shadow-sm p-7 sm:p-9 relative overflow-hidden backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: Date Specification */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A5F] animate-ping" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#2D6A5F]">
                  Tentative Congress Dates Confirmed
                </span>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#103029]">
                1st & 2nd December 2026
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-[#50726B] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2D6A5F] shrink-0" />
                  <span>Academic Medical Convention Center & Digital Hybrid Stream</span>
                </div>
                <div className="text-[11px] text-[#719089]">
                  * Dates are tentative and scheduled for final faculty calendar gazette in early 2026.
                </div>
              </div>
            </div>

            {/* Right: Tabular Countdown Timer */}
            <div className="bg-[#F8FAF9] p-5 sm:p-6 rounded-2xl border border-[#DFECE7] lg:min-w-[380px]">
              <div className="text-[11px] uppercase tracking-wider text-[#63847D] font-medium mb-3 flex items-center justify-between">
                <span>Countdown to Assembly</span>
                <span className="font-mono text-[#25574D]">09:00 AM UTC</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((slot, index) => (
                  <div
                    key={index}
                    className="p-3 text-center bg-white rounded-xl border border-[#DCE8E3] shadow-2xs"
                  >
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[#143B33] tabular-nums">
                      {String(slot.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6E8F88] font-medium mt-1">
                      {slot.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#2D6A5F] hover:bg-[#205147] text-white font-medium text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Bell className="w-4 h-4 text-emerald-200" />
            <span>Join Priority Notification List</span>
          </button>

          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F2F7F5] border border-[#CFDFDA] text-[#204941] font-medium text-sm transition-colors cursor-pointer shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-[#2D6A5F]" />
            <span>Add to Calendar (Dec 1–2)</span>
          </button>

          <button
            onClick={onOpenNextJsCode}
            className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-xs font-medium text-[#466B63] hover:text-[#18463D] hover:bg-[#EBF3F0] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2D6A5F]" />
            <span>Get Next.js Project Code</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtle Trust & Accreditation Strip */}
        <div className="mt-12 pt-8 border-t border-[#E3ECE8] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5D7E77]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D6A5F]" />
            <span>Continuous Medical Education (CME) Accreditation under review</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Peer-Reviewed Clinical Proceedings</span>
            <span aria-hidden="true" className="text-[#C0D3CD]">·</span>
            <span>Young Clinician Travel Grants</span>
            <span aria-hidden="true" className="text-[#C0D3CD]">·</span>
            <span>Hybrid Global Streams</span>
          </div>
        </div>
      </div>
    </section>
  );
}
