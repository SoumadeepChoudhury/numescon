import React, { useState } from 'react';
import { Menu, X, Code2, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenCalendar: () => void;
  onOpenNextJsCode: () => void;
}

export default function Navbar({
  onOpenRegister,
  onOpenCalendar,
  onOpenNextJsCode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFBF9]/95 backdrop-blur-md border-b border-[#E2ECE8] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="text-2xl font-serif font-bold tracking-tight text-[#143931] hover:text-[#23584E] transition-colors"
        >
          NUMESCON 2026
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B6B64]">
          <a href="#overview" className="hover:text-[#18463D] transition-colors">
            Congress Overview
          </a>
          <a href="#dates" className="hover:text-[#18463D] transition-colors">
            Key Dates
          </a>
          <a href="#symposia" className="hover:text-[#18463D] transition-colors">
            Academic Pillars
          </a>
          <a href="#milestones" className="hover:text-[#18463D] transition-colors">
            Roadmap
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenNextJsCode}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#29544B] bg-[#EBF3F0] hover:bg-[#DEECE7] rounded-xl border border-[#D1E3DC] transition-all whitespace-nowrap"
            title="View & copy Next.js project code"
          >
            <Code2 className="w-3.5 h-3.5 text-[#2D6A5F]" />
            <span>Next.js Code</span>
          </button>

          <button
            onClick={onOpenRegister}
            type="button"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A5F] hover:bg-[#205247] rounded-xl transition-all shadow-xs whitespace-nowrap"
          >
            Pre-Register
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenNextJsCode}
            type="button"
            className="p-2 rounded-lg text-[#2D6A5F] bg-[#EAF2EF] border border-[#D5E5E0]"
            aria-label="Next.js Code"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 rounded-lg text-[#355B53] hover:bg-[#EEF4F1]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2ECE8] bg-[#FAFBF9] px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2.5 text-sm font-medium text-[#466962]">
            <a 
              href="#overview" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#18463D]"
            >
              Congress Overview
            </a>
            <a 
              href="#dates" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#18463D]"
            >
              Key Dates
            </a>
            <a 
              href="#symposia" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#18463D]"
            >
              Academic Pillars
            </a>
            <a 
              href="#milestones" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#18463D]"
            >
              Roadmap
            </a>
          </nav>
          <div className="pt-3 border-t border-[#E5EFEA] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalendar();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D2E4DD] text-xs font-medium text-[#29544B] bg-white flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#2D6A5F]" />
              <span>Save Dates to Calendar</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2D6A5F] text-white text-xs font-semibold"
            >
              Join Priority Notice List
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
