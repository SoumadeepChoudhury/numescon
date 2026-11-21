'use client';

import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { CLUSTERS, ClusterId, Workshop } from '@/data/conferenceData';

interface ClusterWorkshopSectionProps {
  onSelectClusterForRegistration: (clusterId: ClusterId) => void;
}

export default function ClusterWorkshopSection({
  onSelectClusterForRegistration,
}: ClusterWorkshopSectionProps) {
  const [selectedClusterId, setSelectedClusterId] = useState<ClusterId>('A');
  const [dayFilter, setDayFilter] = useState<'all' | 1 | 2>('all');

  const clusterKeys: ClusterId[] = ['A', 'B', 'C'];
  const activeCluster = CLUSTERS[selectedClusterId];

  const day1Workshops = activeCluster.workshops.filter((w) => w.day === 1);
  const day2Workshops = activeCluster.workshops.filter((w) => w.day === 2);

  const getClusterIcon = (id: ClusterId) => {
    switch (id) {
      case 'A':
        return <Activity className="w-5 h-5 text-rose-700" />;
      case 'B':
        return <HeartPulse className="w-5 h-5 text-blue-700" />;
      case 'C':
        return <Stethoscope className="w-5 h-5 text-emerald-700" />;
    }
  };

  const renderWorkshopCard = (ws: Workshop, idx: number) => (
    <div
      key={ws.id}
      className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
    >
      <div>
        {/* Top Metadata Row (Clean Unboxed Typography) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100 font-mono tabular-nums">
          <span className="font-bold text-blue-900">
            Day {ws.day} · Workshop 0{idx + 1}
          </span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{ws.timeSlot}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mb-2 leading-snug">
          {ws.title}
        </h4>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {ws.subtitle}
        </p>

        {/* Faculty & Venue */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-sm space-y-2 mb-6">
          <div className="flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-blue-900 mt-1 shrink-0" />
            <div>
              <strong className="text-slate-900 block font-semibold">
                {ws.leadFaculty}
              </strong>
              <span className="text-slate-600 text-xs block">
                {ws.facultyDesignation}
              </span>
              <span className="text-slate-600 text-xs block">
                {ws.facultyAffiliation}
              </span>
            </div>
          </div>

          {/* <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-slate-600 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{ws.hall}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-semibold text-slate-900">{ws.duration}</span>
          </div> */}
        </div>

        {/* Learning Outcomes */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-3">
            Mastered Competencies
          </span>
          <ul className="space-y-2.5 text-sm text-slate-700">
            {ws.learningOutcomes.map((outcome, oIdx) => (
              <li key={oIdx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="leading-snug">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Subtle Prerequisites Footer (No seats left meter) */}
      <div className="pt-5 mt-6 border-t border-slate-100">
        <span className="text-xs text-slate-500 italic block">
          {ws.prerequisites}
        </span>
      </div>
    </div>
  );

  return (
    <section id="clusters" className="py-24 sm:py-32 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900 mb-3">
            3 Workshop Clusters · 3 Workshops Each Day · 28th &amp; 29th November 2026
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
            Choose Your Workshop Cluster
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
            NUMESCON 2026 features three curated practical tracks at North Bengal Medical College &amp; Hospital — <strong>Dopamine Drive</strong>, <strong>Atropine Alert</strong>, and <strong>Linezolid Line</strong>. Each cluster delivers 3 hands-on workshops on Day 1 (28 Nov) and 3 hands-on workshops on Day 2 (29 Nov).
          </p>
        </div>

        {/* 3 Large, Touch-Friendly Cluster Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-2 bg-slate-100/90 rounded-2xl mb-10">
          {clusterKeys.map((key) => {
            const cl = CLUSTERS[key];
            const isSelected = selectedClusterId === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedClusterId(key)}
                className={`relative flex items-center gap-3.5 p-4 sm:p-5 rounded-xl text-left transition-all cursor-pointer active:scale-[0.99] ${isSelected
                  ? 'bg-white shadow-sm text-slate-950 font-bold border-2 border-blue-900/80 sm:border-transparent'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-semibold border-2 border-transparent'
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-50 text-blue-900' : 'bg-slate-200/80 text-slate-700'
                    }`}
                >
                  {getClusterIcon(key)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900">
                      Cluster {key}
                    </span>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      4 Workshops
                    </span>
                  </div>
                  <span className="block text-base sm:text-lg font-extrabold font-serif leading-tight text-slate-950 truncate mt-0.5">
                    {cl.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Cluster Overview Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 sm:p-11 mb-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900 block mb-2">
                Cluster {activeCluster.id} · 2-Day Hands-On Track (3 + 3 Workshops)
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 leading-tight">
                {activeCluster.title}
              </h3>
              <p className="text-base sm:text-lg font-medium text-slate-600 mt-2">
                {activeCluster.tagline}
              </p>
            </div>

            <button
              onClick={() => onSelectClusterForRegistration(selectedClusterId)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-2xl shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer self-start lg:self-auto"
            >
              <span>Enroll in {activeCluster.name}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="font-bold text-slate-900 block mb-2 uppercase tracking-wide text-xs">
                Cluster Scope &amp; Curriculum
              </span>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {activeCluster.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-2 uppercase tracking-wide text-xs">
                Recommended For
              </span>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {activeCluster.idealFor}
              </p>
            </div>
          </div>
        </div>

        {/* Day Filter Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="text-sm font-semibold text-slate-600">
            Showing workshops for <strong className="text-slate-950">{activeCluster.title}</strong>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl">
            <button
              onClick={() => setDayFilter('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${dayFilter === 'all'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              Both Days (6)
            </button>
            <button
              onClick={() => setDayFilter(1)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${dayFilter === 1
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              Day 1 · 28 Nov (3)
            </button>
            <button
              onClick={() => setDayFilter(2)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${dayFilter === 2
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              Day 2 · 29 Nov (3)
            </button>
          </div>
        </div>

        {/* Day 1 Workshops Section */}
        {(dayFilter === 'all' || dayFilter === 1) && (
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-blue-900" />
                <h4 className="font-serif text-2xl font-bold text-slate-950">
                  Day 1 · Saturday, 28 November 2026
                </h4>
              </div>
              <span className="text-xs sm:text-sm font-mono font-semibold text-slate-500 tabular-nums">
                4:00 PM – 7:00 PM · 2 Practical Workshops
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {day1Workshops.map((ws, idx) => renderWorkshopCard(ws, idx))}
            </div>
          </div>
        )}

        {/* Day 2 Workshops Section */}
        {(dayFilter === 'all' || dayFilter === 2) && (
          <div className="mb-16">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-blue-900" />
                <h4 className="font-serif text-2xl font-bold text-slate-950">
                  Day 2 · Sunday, 29 November 2026
                </h4>
              </div>
              <span className="text-xs sm:text-sm font-mono font-semibold text-slate-500 tabular-nums">
                2 Practical Workshops · Exact Hourly Timings TBA
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {day2Workshops.map((ws, idx) => renderWorkshopCard(ws, idx))}
            </div>
          </div>
        )}

        {/* Quick Cluster Selector Helper Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              Ready to register for {activeCluster.name} workshops?
            </h4>
            <p className="text-base text-slate-300 mt-2 max-w-xl">
              Registration is strictly for hands-on workshops — guest lectures and talks require no registration. No student login needed; complete the form directly to get your Workshop Pass.
            </p>
          </div>

          <button
            onClick={() => onSelectClusterForRegistration(selectedClusterId)}
            className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl text-base font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer"
          >
            Register for {activeCluster.name} →
          </button>
        </div>
      </div>
    </section>
  );
}
