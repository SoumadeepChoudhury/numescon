'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  CheckCircle2,
  Layers,
  Info,
} from 'lucide-react';
import { SCHEDULE_DAYS, SCHEDULE_EVENTS, ScheduleEvent } from '@/data/conferenceData';

export default function EventsScheduleSection() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Ceremony', 'Keynote', 'Symposium', 'Cultural', 'Workshop'];

  const filteredEvents = SCHEDULE_EVENTS.filter((ev) => {
    const matchesDay = ev.day === selectedDay;
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.speaker && ev.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ev.slotBadge && ev.slotBadge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: ScheduleEvent['category']) => {
    switch (cat) {
      case 'Keynote':
        return 'text-blue-900 bg-blue-50 border-blue-200';
      case 'Workshop':
        return 'text-indigo-900 bg-indigo-50 border-indigo-200';
      case 'Symposium':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Competition':
        return 'text-amber-900 bg-amber-50 border-amber-200';
      case 'Ceremony':
        return 'text-rose-900 bg-rose-50 border-rose-200';
      case 'Cultural':
        return 'text-amber-900 bg-amber-50 border-amber-200';
    }
  };

  return (
    <section id="schedule" className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900 mb-3">
            2-Day Academic Fest Itinerary · 28th &amp; 29th November 2026
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
            Academic Fest Agenda &amp; Events
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
            Hosted at NBMC&amp;H Auditorium, North Bengal Medical College &amp; Hospital. Explore Day 1 (28 Nov) plenary slots — including the Guest Lecture by Dr. Deepak Marwah — and the 3-cluster practical workshop tracks across both days.
          </p>
        </div>

        {/* 2-Day Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {SCHEDULE_DAYS.map((dayObj) => {
            const isSelected = selectedDay === dayObj.day;
            return (
              <button
                key={dayObj.day}
                onClick={() => {
                  setSelectedDay(dayObj.day);
                  setSelectedCategory('All');
                }}
                className={`p-6 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {dayObj.label}
                  </span>
                  <Calendar className={`w-4 h-4 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`} />
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {dayObj.dateStr}
                </div>
                <p className={`text-sm mt-2 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {dayObj.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Day 2 Info Banner */}
        {selectedDay === 2 && (
          <div className="mb-8 p-5 sm:p-6 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3.5 text-sm text-blue-950">
            <Info className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">
                Day 2 Practical Workshops Confirmed · Additional Auditorium Slots TBA
              </strong>
              <span className="text-slate-700">
                All three cluster workshop tracks for 29th November 2026 are confirmed below. Morning auditorium sessions and exact hourly timings for Day 2 will be announced shortly.
              </span>
            </div>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-5 items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search slots, speakers, or workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
            />
          </div>
        </div>

        {/* Event Timeline List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No sessions match your search</h4>
            <p className="text-sm text-slate-500 mt-1">Try switching categories or clearing search keywords.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="md:w-64 shrink-0">
                  <div className="flex items-center gap-2 text-base font-bold font-mono text-slate-950 mb-2.5 tabular-nums">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <span>{ev.startTime} – {ev.endTime}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {ev.slotBadge && (
                      <span className="inline-block px-3 py-1 text-xs font-extrabold rounded-lg bg-slate-950 text-white tracking-wider">
                        {ev.slotBadge}
                      </span>
                    )}
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${getCategoryColor(ev.category)}`}>
                      {ev.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mb-2 leading-snug">
                    {ev.title}
                  </h4>

                  {ev.speaker && (
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
                      <User className="w-4 h-4 text-blue-900/70" />
                      <span>{ev.speaker}</span>
                      {ev.speakerRole && (
                        <span className="text-slate-500 font-normal">({ev.speakerRole})</span>
                      )}
                    </div>
                  )}

                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {ev.description}
                  </p>

                  {ev.highlights && ev.highlights.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      {ev.highlights.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold border border-slate-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dedicated Visual Matrix for the 3 Named Cluster Tracks (Day 1 or Day 2) */}
        <div className="mt-12 bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                <Layers className="w-4 h-4" />
                <span>
                  {selectedDay === 1
                    ? 'Day 1 · 28 November 2026 · 4:00 PM – 7:00 PM'
                    : 'Day 2 · 29 November 2026 · 3 Sessions per Cluster'}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                {selectedDay === 1
                  ? 'Day 1 Cluster Practical Workshop Matrix'
                  : 'Day 2 Cluster Practical Workshop Matrix'}
              </h3>
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 self-start sm:self-auto">
              3 Parallel Clusters · NBMC&amp;H
            </span>
          </div>

          {selectedDay === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  CLUSTER A
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Dopamine Drive
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>BLS</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">4–5 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>Fracture Management</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">5–6 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span>POCUS</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">6–7 PM</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  CLUSTER B
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Atropine Alert
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>Neonatal Resuscitation</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">4–5 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>BLS</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">5–6 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span>Tracheostomy</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">6–7 PM</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  CLUSTER C
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Linezolid Line
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>Suturing &amp; Surgical Skills</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">4–5 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                    <span>ECG Made Easy</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">5–6 PM</span>
                  </li>
                  <li className="flex items-start justify-between gap-3">
                    <span>Active Management of Labor</span>
                    <span className="font-mono text-xs text-slate-400 shrink-0 tabular-nums">6–7 PM</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  CLUSTER A
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Dopamine Drive
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="border-b border-white/10 pb-2">
                    Safe Injection Practices &amp; Transfusion Procedures
                  </li>
                  <li className="border-b border-white/10 pb-2">
                    OAE Test &amp; Stroboscopy
                  </li>
                  <li>Pulmonary Function Test</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  CLUSTER B
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Atropine Alert
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="border-b border-white/10 pb-2">
                    Advanced Trauma Care
                  </li>
                  <li className="border-b border-white/10 pb-2">
                    OT Table Dynamics &amp; Anaesthetic Precision
                  </li>
                  <li>CT Scan &amp; MRI</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  CLUSTER C
                </span>
                <h4 className="font-serif text-xl font-bold text-white mb-4">
                  Linezolid Line
                </h4>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="border-b border-white/10 pb-2">BLS</li>
                  <li className="border-b border-white/10 pb-2">
                    Pediatric Life Support
                  </li>
                  <li>Biopsy / FNAC</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
