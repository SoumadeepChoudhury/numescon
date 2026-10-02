import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ArrowRight, Activity, Syringe, HeartPulse, Brain } from 'lucide-react';

interface PillarsTracksProps {
  onOpenRegisterWithTrack: (trackName: string) => void;
}

export default function PillarsTracks({ onOpenRegisterWithTrack }: PillarsTracksProps) {
  const [expandedTrack, setExpandedTrack] = useState<number | null>(0);

  const tracks = [
    {
      id: 0,
      code: 'TRACK I',
      title: 'Internal Medicine, Cardiology & Metabolic Horizons',
      lead: 'Cardiometabolic Syndromes · Resistant Hypertension · Nephrology & Endocrinology',
      icon: HeartPulse,
      description:
        'A comprehensive exploration of complex multisystem pathophysiology. From modern cardiometabolic risk stratification to precision biologic therapies for autoimmune and renal disorders.',
      topics: [
        'Advanced Heart Failure with Preserved Ejection Fraction (HFpEF)',
        'Novel SGLT2i & GLP-1 RA Therapeutics Across Renal and Cardiovascular Spectra',
        'Autoimmune Flares in Rheumatology: Bedside Evaluation & Target Biologics',
        'Complex Inpatient Antimicrobial Stewardship in Era of Multidrug Resistance',
      ],
    },
    {
      id: 1,
      code: 'TRACK II',
      title: 'Surgical Sciences, Minimal Access & Trauma Care',
      lead: 'General Surgery · Minimal Invasive Laparoscopy · Acute Trauma Protocols',
      icon: Syringe,
      description:
        'Bridging operative mastery with perioperative safety. Delving into minimally invasive abdominal surgery, trauma damage control, and enhanced recovery after surgery (ERAS) pathways.',
      topics: [
        'Single-Port & Robotic Laparoscopy: Clinical Indications and Pitfalls',
        'Massive Transfusion Protocols & Damage Control Surgery in Polytrauma',
        'Perioperative Hemodynamic Optimization and Organ Protection',
        'Innovations in Surgical Wound Healing and Biocompatible Matrices',
      ],
    },
    {
      id: 2,
      code: 'TRACK III',
      title: 'Emergency Medicine, Resuscitation & Critical Care',
      lead: 'POCUS (Point of Care Ultrasound) · Sepsis Bundles · Invasive Mechanical Ventilation',
      icon: Activity,
      description:
        'Rapid assessment in the golden hour. Integrating bedside ultrasonography, physiological monitoring in the medical/surgical ICU, and neuro-critical care protocols.',
      topics: [
        'Critical Care Ultrasound: Rapid Hemodynamic & Lung Echo Triage',
        'Refractory Septic Shock & Vasopressor De-escalation Strategies',
        'ARDS Management: Prone Positioning, Lung-Protective Ventilation & ECMO Candidate Selection',
        'Acute Stroke & Neurocritical Interventions in the Resuscitation Bay',
      ],
    },
    {
      id: 3,
      code: 'TRACK IV',
      title: 'Pediatrics, Clinical Genetics & Preventive Health',
      lead: 'Neonatal Critical Care · Inborn Errors of Metabolism · Primary Healthcare Equity',
      icon: Brain,
      description:
        'Safeguarding the next generation through early metabolic screening, neonatal intensive care protocols, pediatric chronic care, and global preventive health vaccination benchmarks.',
      topics: [
        'Neonatal Encephalopathy & Therapeutic Hypothermia Protocol Standards',
        'Next-Generation Genomic Screening in Rare Pediatric Genetic Disorders',
        'Pediatric Sepsis Recognition and Early Fluid Resuscitation Algorithms',
        'Adolescent Mental Health Integration into Primary Care Practices',
      ],
    },
  ];

  return (
    <section id="symposia" className="py-20 lg:py-28 bg-[#FAFBF9] relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-widest font-semibold text-[#2D6A5F] mb-3">
            Scientific Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#12312A] leading-tight mb-4">
            Tentative Academic Symposia & Tracks
          </h2>
          <p className="text-sm sm:text-base text-[#4E7068] leading-relaxed">
            The scientific committee has delineated four major academic tracks for NUMESCON 2026. Detailed plenary agendas and call for clinical cases will be announced in mid-2026.
          </p>
        </div>

        {/* Tracks List */}
        <div className="space-y-4">
          {tracks.map((track) => {
            const isExpanded = expandedTrack === track.id;
            const Icon = track.icon;

            return (
              <div
                key={track.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-white border-[#BDD6CD] shadow-sm'
                    : 'bg-[#F4F8F6] border-[#D9E7E2] hover:border-[#CADCD6]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                  className="w-full p-6 sm:p-7 flex items-start justify-between gap-4 text-left cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        isExpanded
                          ? 'bg-[#E3EFEA] text-[#20544A] border-[#BCD4CB]'
                          : 'bg-white text-[#4A7269] border-[#D7E5E0]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-mono font-semibold text-[#2D6A5F] tracking-wider uppercase">
                        {track.code}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#143931]">
                        {track.title}
                      </h3>
                      <p className="text-xs text-[#5D8078] hidden sm:block">
                        {track.lead}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg text-[#61857E] hover:text-[#18463D] hover:bg-[#EBF3F0] shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-[#EDF4F1] space-y-5">
                    <p className="text-xs sm:text-sm text-[#45675F] leading-relaxed">
                      {track.description}
                    </p>

                    <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E1ECE7] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#235349] uppercase tracking-wide">
                        <FileText className="w-3.5 h-3.5 text-[#2D6A5F]" />
                        <span>Featured Session Topics & Discussions</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3E6159]">
                        {track.topics.map((topic, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[#2D6A5F] font-bold">·</span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-[#6F8E87]">
                        Abstract submissions for this track open June 2026.
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenRegisterWithTrack(track.title)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D6A5F] hover:text-[#1A4B42] hover:underline"
                      >
                        <span>Pre-register for Track Updates</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
