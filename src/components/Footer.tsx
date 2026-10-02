import React from 'react';
import { Mail, Calendar, FileText, Shield, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenCalendar: () => void;
  onOpenRegister: () => void;
  onOpenNextJsCode: () => void;
}

export default function Footer({
  onOpenCalendar,
  onOpenRegister,
  onOpenNextJsCode,
}: FooterProps) {
  return (
    <footer className="bg-[#FAFBF9] border-t border-[#DFECE7] text-[#4F6E66] text-xs">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-[#E3EDE9]">
          {/* Col 1: Wordmark & Statement */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-xl font-serif font-bold text-[#143931] tracking-tight block">
              NUMESCON 2026
            </span>
            <p className="text-xs text-[#52746C] max-w-md leading-relaxed">
              The premier national congregation of clinicians, postgraduate residents, and undergraduate medical scholars. Advancing clinical care, surgical technique, and translational biomedical inquiry.
            </p>
            <div className="text-[11px] text-[#6E8F88] pt-1">
              Tentative Dates: <strong>1st & 2nd December 2026</strong> · Academic Medical Convention Center
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-semibold text-[#1F463E] uppercase tracking-wider text-[11px] block mb-3">
              Congress Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-[#19453C] transition-colors">
                  Congress Overview
                </a>
              </li>
              <li>
                <a href="#dates" className="hover:text-[#19453C] transition-colors">
                  Key Dates & Countdown
                </a>
              </li>
              <li>
                <a href="#symposia" className="hover:text-[#19453C] transition-colors">
                  Academic Symposia
                </a>
              </li>
              <li>
                <a href="#milestones" className="hover:text-[#19453C] transition-colors">
                  Milestone Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Contacts */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-semibold text-[#1F463E] uppercase tracking-wider text-[11px] block mb-3">
              Academic Secretariat
            </span>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:secretariat@numescon.org"
                className="flex items-center gap-2 hover:text-[#19453C] transition-colors text-[#31574F]"
              >
                <Mail className="w-3.5 h-3.5 text-[#2D6A5F]" />
                <span>secretariat@numescon.org</span>
              </a>

              <button
                onClick={onOpenCalendar}
                className="flex items-center gap-2 hover:text-[#19453C] transition-colors text-left"
              >
                <Calendar className="w-3.5 h-3.5 text-[#2D6A5F]" />
                <span>Download Calendar Invite (.ics)</span>
              </button>

              <button
                onClick={onOpenNextJsCode}
                className="flex items-center gap-2 hover:text-[#19453C] transition-colors text-left font-medium text-[#23564D]"
              >
                <Code2 className="w-3.5 h-3.5 text-[#2D6A5F]" />
                <span>Next.js Source Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Advisory / Disclaimer and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] text-[#719089]">
          <p className="max-w-2xl leading-relaxed">
            * <strong>Notice of Intent:</strong> NUMESCON 2026 details and tentative dates (1st–2nd December 2026) are subject to official council ratification. Pre-registered delegates will receive timely notification when venue contracts and full registration packages are released.
          </p>
          <p className="shrink-0">
            © 2026 NUMESCON Academic Secretariat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
