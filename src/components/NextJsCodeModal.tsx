import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Download, Sparkles } from 'lucide-react';

interface NextJsCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NextJsCodeModal({ isOpen, onClose }: NextJsCodeModalProps) {
  const [activeTab, setActiveTab] = useState<'page' | 'layout' | 'tailwind' | 'setup'>('page');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeFiles = {
    page: `// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Tentative target: 1st December 2026, 09:00 AM UTC
    const target = new Date('2026-12-01T09:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen max-h-screen overflow-hidden bg-[#F8FAF9] text-[#1E2E2B] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative select-none">
      {/* Background medical glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#2D6A5F]/10 via-[#4E8E81]/5 to-transparent rounded-full blur-3xl pointer-events-none" 
      />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2D6A5F] animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#2D6A5F]">
            North Bengal Medical College
          </span>
        </div>
        <div className="text-xs text-[#6B8A83] font-medium hidden sm:block">
          Official Website Launching Soon
        </div>
      </header>

      {/* Center Main Stage */}
      <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-4">
        {/* Presenter Kicker */}
        <p className="font-serif italic text-lg sm:text-2xl text-[#39675D] mb-3">
          North Bengal Medical College presents
        </p>

        {/* Grand Congress Title */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#11332C] leading-none mb-4">
          NUMESCON 2026
        </h1>

        <p className="text-sm sm:text-base text-[#4E7068] font-medium tracking-wide max-w-xl mx-auto mb-8">
          The Annual Medical Sciences & Clinical Research Congress is Coming Soon.
        </p>

        {/* Tentative Dates Announcement Badge */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl bg-white/80 border border-[#D5E4DF] shadow-2xs backdrop-blur-xs mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#2D6A5F]">
              Tentative Dates:
            </span>
            <span className="font-serif text-lg sm:text-xl font-bold text-[#143B33]">
              1st & 2nd December 2026
            </span>
          </div>
          <span className="hidden sm:inline text-[#C0D4CD]">·</span>
          <span className="text-xs text-[#5D8078]">
            Original website & full event schedule to be announced
          </span>
        </div>

        {/* Live Countdown Timer */}
        <div className="max-w-xl mx-auto grid grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Minutes', val: timeLeft.minutes },
            { label: 'Seconds', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-5 rounded-2xl bg-white/90 border border-[#D6E5E0] shadow-sm backdrop-blur-xs"
            >
              <div className="font-mono text-2xl sm:text-4xl font-bold text-[#143B33] tabular-nums">
                {String(item.val).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#6F9088] font-medium mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6F8E88] pt-4 border-t border-[#DFECE7]">
        <div>All scientific tracks, speaker lineups & delegate bookings will launch on the official website.</div>
        <div>© 2026 North Bengal Medical College</div>
      </footer>
    </main>
  );
}`,
    layout: `// app/layout.tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'NUMESCON 2026 | North Bengal Medical College',
  description: 'North Bengal Medical College presents NUMESCON 2026. Tentative dates: 1st & 2nd December 2026. Coming Soon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={\`\${cormorant.variable} \${plusJakarta.variable}\`}>
      <body className="font-sans antialiased overflow-hidden">{children}</body>
    </html>
  );
}`,
    tailwind: `// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;`,
    setup: `# Setting up your Next.js Single-View Teaser

1. Create a Next.js 14/15 project:
   npx create-next-app@latest numescon-2026 --typescript --tailwind --app --eslint

2. Install Lucide icons:
   cd numescon-2026
   npm install lucide-react

3. Copy the code into:
   - app/page.tsx
   - app/layout.tsx
   - tailwind.config.ts

4. Run locally:
   npm run dev
`,
  };

  const handleCopy = () => {
    const textToCopy = codeFiles[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-3xl h-[80vh] flex flex-col bg-[#142320] text-[#E0EBE7] rounded-2xl border border-[#2D4D45] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#25413A] bg-[#0E1A17]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A5F]/40 border border-[#3E8073]/50 flex items-center justify-center text-emerald-300">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Next.js Single-View Project Code</span>
              <p className="text-xs text-[#8BA49D]">North Bengal Medical College presents NUMESCON 2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8BA49D] hover:text-white hover:bg-[#203932] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-2 border-b border-[#223B34] bg-[#12201D] text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'page', label: 'app/page.tsx' },
              { id: 'layout', label: 'app/layout.tsx' },
              { id: 'tailwind', label: 'tailwind.config.ts' },
              { id: 'setup', label: 'Setup Guide' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-md transition-colors font-mono ${
                  activeTab === tab.id
                    ? 'bg-[#2D6A5F] text-white font-medium'
                    : 'text-[#96AEA7] hover:text-white hover:bg-[#1A302A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto bg-[#0C1513] font-mono text-xs text-[#CFDDD8] leading-relaxed">
          <pre className="whitespace-pre">{codeFiles[activeTab]}</pre>
        </div>
      </div>
    </div>
  );
}
