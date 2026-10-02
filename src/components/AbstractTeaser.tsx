import React from 'react';
import { Award, BookOpen, Send, Sparkles, FileSpreadsheet, Check } from 'lucide-react';

interface AbstractTeaserProps {
  onOpenRegisterWithAbstract: () => void;
}

export default function AbstractTeaser({ onOpenRegisterWithAbstract }: AbstractTeaserProps) {
  return (
    <section className="py-20 lg:py-24 bg-[#FAFBF9] border-t border-[#E1ECE7] relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="bg-[#15342E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          {/* Subtle medical organic background art */}
          <div 
            aria-hidden="true" 
            className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#2D6A5F]/20 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#204941] text-[#9CD8C9] text-xs font-medium border border-[#2D6156]">
              <Award className="w-3.5 h-3.5" />
              <span>Scientific Research & Presentation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F3FAF7] leading-tight">
              Call for Abstracts, Case Reports & Scientific Posters
            </h2>

            <p className="text-sm sm:text-base text-[#BFDCD4] leading-relaxed">
              NUMESCON 2026 invites prospective submissions from consultants, residents, postgraduate scholars, and undergraduate medical students. Accepted abstracts will be published in the official congress indexed proceedings.
            </p>

            {/* Submission Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-2">
              {[
                'Original Clinical Trials & Meta-Analyses',
                'Rare & Instructive Clinical Vignettes',
                'Surgical Video & Technique Demonstrations',
                'Hospital Quality Improvement & Patient Safety Initiatives',
              ].map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1A3F38]/60 border border-[#27534A] text-xs text-[#E1EFEA]"
                >
                  <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{category}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenRegisterWithAbstract}
                className="px-6 py-3.5 rounded-xl bg-[#E8F3EF] hover:bg-white text-[#133830] font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#2D6A5F]" />
                <span>Notify Me When Abstract Submission Opens</span>
              </button>

              <span className="text-xs text-[#95B9AF]">
                Submission Window: Anticipated June – September 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
