'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Award, ShieldCheck, Utensils, Building2 } from 'lucide-react';
import { COMMITTEE_MEMBERS, CommitteeMember } from '@/data/conferenceData';

type TierFilter = 'All' | CommitteeMember['tier'];

export default function CommitteeSection() {
  const [activeTier, setActiveTier] = useState<TierFilter>('All');

  const tiers: { id: TierFilter; label: string; count: number }[] = [
    { id: 'All', label: 'Full Committee', count: COMMITTEE_MEMBERS.length },
    {
      id: 'Organiser',
      label: 'Organiser',
      count: COMMITTEE_MEMBERS.filter((m) => m.tier === 'Organiser').length,
    },
    {
      id: 'Joint Organiser',
      label: 'Joint Organisers',
      count: COMMITTEE_MEMBERS.filter((m) => m.tier === 'Joint Organiser').length,
    },
    {
      id: 'Executive Members',
      label: 'Executive Members',
      count: COMMITTEE_MEMBERS.filter((m) => m.tier === 'Executive Members').length,
    },
    {
      id: 'Food Committee',
      label: 'Food Committee',
      count: COMMITTEE_MEMBERS.filter((m) => m.tier === 'Food Committee').length,
    },
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const coreLeadership = COMMITTEE_MEMBERS.filter(
    (m) => m.tier === 'Organiser' || m.tier === 'Joint Organiser'
  );
  const executiveMembers = COMMITTEE_MEMBERS.filter((m) => m.tier === 'Executive Members');
  const foodCommittee = COMMITTEE_MEMBERS.filter((m) => m.tier === 'Food Committee');

  const filteredMembers = COMMITTEE_MEMBERS.filter((m) =>
    activeTier === 'All' ? true : m.tier === activeTier
  );

  const renderMemberCard = (member: CommitteeMember, idx: number) => {
    const isLeadership =
      member.tier === 'Organiser' || member.tier === 'Joint Organiser';

    return (
      <motion.div
        key={member.id}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{
          duration: 0.4,
          delay: Math.min(idx * 0.04, 0.25),
          ease: [0.16, 1, 0.3, 1],
        }}
        className="rounded-3xl p-6 sm:p-7 border transition-colors flex flex-col justify-between bg-white text-slate-950 border-slate-200 hover:border-slate-300"
      >
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center font-serif font-bold text-lg shrink-0 bg-slate-100 text-slate-900 border border-slate-200">
              {getInitials(member.name)}
            </div>

            <div className="min-w-0">
              <div
                className={`text-xs font-semibold tracking-wider uppercase mb-1 ${
                  isLeadership ? 'text-blue-900' : 'text-slate-500'
                }`}
              >
                {member.role}
              </div>
              <h4 className="font-serif text-xl font-bold leading-snug truncate text-slate-950">
                {member.name}
              </h4>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-slate-600 text-xs space-y-1.5">
            <div className="font-medium">{member.department}</div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{member.institution}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 text-slate-500 flex items-center justify-between text-xs">
          <span>NUMESCON 2026</span>
          <span aria-hidden="true">·</span>
          <span>{member.tier}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="committee" className="py-24 sm:py-32 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-900 mb-3">
              <Users className="w-4 h-4" />
              <span>Official Roster · NUMESCON 2026</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
              NBMC Leadership &amp; Organizing Committee
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
              Meet the dedicated NUMESCON 2026 Organizing Committee of North Bengal Medical College &amp; Hospital leading the academic program, workshop tracks, and delegate hospitality.
            </p>
          </div>

          <div className="self-start md:self-auto flex items-center gap-2 text-xs font-medium text-slate-500 tabular-nums">
            <span>{COMMITTEE_MEMBERS.length} Official Members</span>
            <span aria-hidden="true">·</span>
            <span>NUMESCON 2026</span>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-14 w-fit max-w-full overflow-x-auto">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTier(t.id)}
              className={`px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                activeTier === t.id
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Grouped Hierarchical View when 'All' is selected */}
        {activeTier === 'All' ? (
          <div className="space-y-16">
            {/* Group 1: Organiser & Joint Organisers */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-blue-900" />
                  <h3 className="font-serif text-2xl font-bold text-slate-950">
                    Organiser &amp; Joint Organisers
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {coreLeadership.length} Leads
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {coreLeadership.map((member, idx) => renderMemberCard(member, idx))}
              </div>
            </div>

            {/* Group 2: Executive Members */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-900" />
                  <h3 className="font-serif text-2xl font-bold text-slate-950">
                    Executive Members
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {executiveMembers.length} Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {executiveMembers.map((member, idx) => renderMemberCard(member, idx))}
              </div>
            </div>

            {/* Group 3: Food Committee */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Utensils className="w-4 h-4 text-blue-900" />
                  <h3 className="font-serif text-2xl font-bold text-slate-950">
                    Food Committee
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {foodCommittee.length} Members
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {foodCommittee.map((member, idx) => renderMemberCard(member, idx))}
              </div>
            </div>
          </div>
        ) : (
          /* Filtered Single-Tier View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMembers.map((member, idx) => renderMemberCard(member, idx))}
          </div>
        )}
      </div>
    </section>
  );
}
