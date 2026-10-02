import React from 'react';
import { Calendar, CheckCircle, Clock, Bell, Sparkles } from 'lucide-react';

interface TimelineMilestonesProps {
  onOpenRegister: () => void;
  onOpenCalendar: () => void;
}

export default function TimelineMilestones({
  onOpenRegister,
  onOpenCalendar,
}: TimelineMilestonesProps) {
  const milestones = [
    {
      phase: 'Phase 1 · Current Milestone',
      date: 'Advance Announcement',
      title: 'Tentative Date Disclosure & Priority Registry',
      desc: 'Initial proclamation of NUMESCON 2026 for 1st & 2nd December 2026. Open priority delegate list and academic curriculum preparation.',
      status: 'Active',
      highlight: true,
    },
    {
      phase: 'Phase 2',
      date: 'June 2026',
      title: 'Call for Abstracts & Clinical Case Submissions',
      desc: 'Official submission portal opens for oral presentations, poster competitions, and randomized controlled trial abstracts.',
      status: 'Upcoming',
      highlight: false,
    },
    {
      phase: 'Phase 3',
      date: 'August 2026',
      title: 'Keynote Faculty & Scientific Program Announcement',
      desc: 'Full reveal of international guest professors, masterclasses in surgical technique, and CME credit allocation schedule.',
      status: 'Upcoming',
      highlight: false,
    },
    {
      phase: 'Phase 4',
      date: 'October 2026',
      title: 'Formal Delegate Registration & Workshop Bookings',
      desc: 'Early-bird conference ticketing, live wet-lab surgical workshop seatings, and partner hospital accommodation concierge.',
      status: 'Upcoming',
      highlight: false,
    },
    {
      phase: 'Phase 5 · The Summit',
      date: '1st & 2nd December 2026',
      title: 'NUMESCON 2026 Congress Opening & Scientific Plenaries',
      desc: 'Two full days of intensive clinical discourses, presidential orations, award ceremonies, and scientific poster exhibits.',
      status: 'Target Date',
      highlight: true,
    },
  ];

  return (
    <section id="milestones" className="py-20 lg:py-28 bg-[#F4F8F6] border-t border-[#DFECE7]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#2D6A5F] mb-3">
              Congress Pathway
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#12312A] leading-tight">
              Road to NUMESCON 2026
            </h2>
            <p className="text-sm sm:text-base text-[#4C6D65] mt-3">
              Follow our academic timeline leading toward the December 2026 congregation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCalendar}
              className="px-4 py-2.5 rounded-xl border border-[#CADBD4] bg-white hover:bg-[#EDF5F2] text-xs font-medium text-[#204940] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#2D6A5F]" />
              <span>Add Dates to Calendar</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2.5 rounded-xl bg-[#2D6A5F] hover:bg-[#204E45] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-200" />
              <span>Get Milestone Alerts</span>
            </button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l-2 border-[#CDDFD8] ml-4 md:ml-6 pl-6 md:pl-10 space-y-10">
          {milestones.map((item, index) => (
            <div key={index} className="relative group">
              {/* Dot on the timeline */}
              <div
                className={`absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform ${
                  item.highlight
                    ? 'bg-[#2D6A5F] border-white ring-4 ring-[#2D6A5F]/20 scale-110'
                    : 'bg-white border-[#84A99F]'
                }`}
              />

              <div
                className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                  item.highlight
                    ? 'bg-white border-[#BED5CC] shadow-xs'
                    : 'bg-[#FAFBF9] border-[#DCE8E3]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#2D6A5F] uppercase tracking-wider">
                    {item.phase}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-[#143B33] bg-[#EAF2EF] px-2.5 py-0.5 rounded-md">
                      {item.date}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        item.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Target Date'
                          ? 'bg-[#E3EDE8] text-[#1D4A41] font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-[#153A32] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E7067] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
