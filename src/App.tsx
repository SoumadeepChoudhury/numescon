import React, { useState, useEffect } from 'react';
import NbmcLogo from './components/NbmcLogo.tsx';
import MedicalBackground from './components/MedicalBackground.tsx';

export default function App() {
  // Target tentative date: 1st December 2026, 09:00 AM UTC
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date('2026-12-01T09:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#F8FAF9] text-[#19332D] flex flex-col justify-between p-5 sm:p-8 lg:p-12 relative select-none">
      {/* 1. Delicate Low-Opacity Medical Background Elements (Organs, Stethoscope, Lungs, DNA, Microscope) */}
      <MedicalBackground />

      {/* 2. Soft Ambient Medical Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-[#2D6A5F]/7 via-[#5E9B90]/4 to-transparent rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* 3. Subtle Medical Grid Overlay */}
      <div className="absolute inset-0 medical-grid-pattern opacity-25 pointer-events-none z-0" />

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between">
        {/* Left: North Bengal Medical College Brand Lockup */}
        <div className="flex items-center gap-3">
          <NbmcLogo size={46} className="shrink-0" />
          <div>
            <span className="text-xs sm:text-sm uppercase tracking-wider font-bold text-[#1F4C43] block">
              North Bengal Medical College
            </span>
            <span className="text-[10px] sm:text-xs text-[#62847D] block">
              Sushrutanagar, Darjeeling · Estd. 1968
            </span>
          </div>
        </div>

        {/* Right: Soft Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-[#4F736C]">
          <span className="w-2 h-2 rounded-full bg-[#2D6A5F] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium tracking-wide">
            Official Website Launching Soon
          </span>
        </div>
      </header>

      {/* CENTER STAGE */}
      <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-2 sm:py-6 flex flex-col items-center">
        {/* Official North Bengal Medical College Emblem */}
        <div className="mb-4 sm:mb-5 transition-transform hover:scale-102 duration-300">
          <div className="p-2 sm:p-2.5 rounded-full bg-white shadow-md border border-[#DCE8E3] inline-block">
            {/* <NbmcLogo size={96} className="sm:w-[112px] sm:h-[112px]" /> 
            */}
            <img
              src="/icon.png"
              alt=""
              className="w-[80px] h-[80px] sm:w-[112px] sm:h-[112px]"
            />
          </div>
        </div>

        {/* Presenter Line */}
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <span className="h-px w-8 sm:w-14 bg-[#2D6A5F]/35" />
          <p className="font-serif italic text-lg sm:text-2xl lg:text-3xl text-[#2F6156] font-normal tracking-wide">
            North Bengal Medical College presents
          </p>
          <span className="h-px w-8 sm:w-14 bg-[#2D6A5F]/35" />
        </div>

        {/* Grand Congress Title */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#0F2F29] leading-none mb-3">
          NUMESCON 2026
        </h1>

        {/* Subtitle / Coming Soon */}
        <p className="text-sm sm:text-lg text-[#3E665E] font-medium tracking-wide max-w-xl mx-auto mb-6 sm:mb-7">
          The Annual Medical Academic Fest is Coming Soon.
        </p>

        {/* Tentative Dates Announcement Card */}
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 rounded-2xl bg-white/95 border border-[#CEE0D9] shadow-xs backdrop-blur-xs mb-7 sm:mb-9 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#2D6A5F]">
              Dates:
            </span>
            <span className="font-serif text-lg sm:text-2xl font-bold text-[#143D34]">
              1st & 2nd December 2026
            </span>
          </div>
          <span className="hidden sm:inline text-[#C0D7CE]">·</span>
          <span className="text-xs text-[#5C8077] font-medium">
            Full event details to be unveiled on the official website
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="w-full max-w-xl mx-auto">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#668B84] font-semibold mb-3">
            Countdown to Congress Assembly
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds },
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-5 rounded-2xl bg-white/95 border border-[#D5E5DF] shadow-xs backdrop-blur-xs"
              >
                <div className="font-mono text-2xl sm:text-4xl lg:text-5xl font-bold text-[#123B33] tabular-nums">
                  {String(slot.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#698C84] font-medium mt-1">
                  {slot.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER STRIP */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#698881] pt-3 sm:pt-4 border-t border-[#DFECE7]">
        <div className="flex items-center gap-2">
          {/* Subtle resting medical ECG pulse */}
          <svg viewBox="0 0 100 20" className="w-14 h-3.5 stroke-[#2D6A5F]/75 fill-none stroke-[1.5]">
            <path d="M0 10 H30 L35 4 L40 16 L45 8 L50 12 L55 10 H100" />
          </svg>
          <span>All scientific sessions, speaker profiles & delegate registrations will launch on the official website.</span>
        </div>

        <div className="text-right">
          © 2026 North Bengal Medical College · All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
