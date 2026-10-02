import React from 'react';
import { Microscope, Stethoscope, HeartHandshake, Shield, Sparkles } from 'lucide-react';

export default function AboutTeaser() {
  return (
    <section id="overview" className="py-20 lg:py-28 bg-[#F3F7F5] border-y border-[#E2ECE8] relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#2D6A5F]">
              Congress Essence
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#12312A] leading-tight">
              An Academic Conclave Rooted in the Healing Art.
            </h2>

            <p className="text-sm sm:text-base text-[#496962] leading-relaxed">
              NUMESCON 2026 brings together medical faculty, resident doctors, undergraduate scholars, and allied researchers to deliberate on modern clinical dilemmas, emerging pharmacological standards, and the timeless ethics of the physician-patient bond.
            </p>

            <div className="p-5 rounded-2xl bg-white border border-[#D7E5E0] space-y-2">
              <div className="text-xs font-semibold text-[#1B433B] uppercase tracking-wide">
                Tentative Notice Noticeboard
              </div>
              <p className="text-xs text-[#52746D] leading-relaxed">
                The full academic brochure, scientific committee panel, abstract submission guidelines, and official venue registration will be inaugurated in early 2026.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Pillars with Editorial Numbering (Anti-Slop Cleanliness) */}
          <div className="lg:col-span-7 space-y-5">
            {[
              {
                number: '01',
                title: 'Clinical Inquiry & Bedside Semiology',
                icon: Stethoscope,
                desc: 'Championing high-fidelity diagnostic acumen, clinical reasoning, and the fundamental physical examination skills that remain irreplaceable by automated algorithms.',
              },
              {
                number: '02',
                title: 'Surgical Innovation & Minimal Access',
                icon: Microscope,
                desc: 'Exploring advances in laparoscopic and endoscopic intervention, reconstructive techniques, patient safety protocols, and post-operative recovery acceleration.',
              },
              {
                number: '03',
                title: 'Compassionate Care & Medical Ethics',
                icon: HeartHandshake,
                desc: 'Reaffirming empathy in critical moments, ethical dilemmas in modern intensive care, palliative communication, and universal patient dignity.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-[#D9E6E1] hover:border-[#BFD8D0] transition-colors shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-serif text-2xl font-bold text-[#8FAEA6] select-none">
                      {pillar.number}
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-serif font-semibold text-[#153B33]">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#4E7068] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
