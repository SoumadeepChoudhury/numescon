'use client';

import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Building2, CheckCircle2, Phone, Mail } from 'lucide-react';

export type PolicyType = 'terms' | 'integrity' | 'safety' | null;

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

export default function PolicyModals({ activePolicy, onClose }: PolicyModalsProps) {
  if (!activePolicy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="px-6 sm:px-8 py-5 bg-slate-950 text-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {activePolicy === 'terms' && <FileText className="w-5 h-5 text-blue-400" />}
            {activePolicy === 'integrity' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            {activePolicy === 'safety' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            <div>
              <span className="block font-serif font-bold text-lg sm:text-xl">
                {activePolicy === 'terms' && 'Terms of Registration'}
                {activePolicy === 'integrity' && 'Academic Integrity Code'}
                {activePolicy === 'safety' && 'Campus Safety & Hospital Protocol'}
              </span>
              <span className="block text-xs font-mono text-slate-400">
                North Bengal Medical College (NBMC) · NUMESCON 2026
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* TERMS OF REGISTRATION */}
          {activePolicy === 'terms' && (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <strong className="block text-blue-950 font-serif text-base mb-1">
                  Official Organizing Institution:
                </strong>
                <span className="text-slate-700 text-sm">
                  North Bengal Medical College & Hospital (NBMC), Sushrutanagar, Siliguri, Darjeeling District, West Bengal 734012.
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-950 text-base">
                  1. Delegate Eligibility & Verification
                </h4>
                <p>
                  NUMESCON 2026 is exclusively open to bona fide undergraduate medical students (MBBS), dental (BDS), nursing, and allied health science scholars currently enrolled in recognized colleges or undergoing compulsory rotatory internship. Delegates must present their official college identity card or a bonafide letter signed by their Dean/Principal at the NBMC Registration Desk upon arrival.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  2. Workshop Registration Scope (November 28 &amp; 29, 2026)
                </h4>
                <p>
                  Registration is required exclusively for participation in the hands-on practical workshop clusters. Guest lectures (including Dr. Deepak Marwah&apos;s session), scientific talks, and general auditorium events are open-entry and do not require separate registration. Confirmed workshop registration covers:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                  <li>Hands-on participation in your selected workshop cluster (Cluster A: Dopamine Drive, Cluster B: Atropine Alert, or Cluster C: Linezolid Line — 3 workshops each day).</li>
                  <li>Practical workbench instruments, simulation consumables, and faculty-guided lab sessions.</li>
                  <li>Official workshop pass, lanyard credential, and printed workshop schedule booklet.</li>
                  <li>Official NUMESCON 2026 workshop participation certificate.</li>
                </ul>

                <h4 className="font-bold text-slate-950 text-base">
                  3. Non-Transferability & Substitution Policy
                </h4>
                <p>
                  Registration passes and unique Delegate IDs (e.g. NUMES-2026-X####) are personal to the registrant. Substitutions between college peers can be entertained up to 72 hours prior to November 28, 2026, upon written request from the parent college student union or institutional head.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  4. Cancellation & Refund Policy
                </h4>
                <p>
                  Requests for cancellation received before November 20, 2026, will be eligible for an 80% refund after nominal administrative processing deductions. No refunds can be issued after November 20 due to practical workshop workbench allocations and logistics commitments.
                </p>
              </div>
            </>
          )}

          {/* ACADEMIC INTEGRITY CODE */}
          {activePolicy === 'integrity' && (
            <>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <strong className="block text-emerald-950 font-serif text-base mb-1">
                  Commitment to Honest Scholarship:
                </strong>
                <span className="text-slate-700 text-sm">
                  Upholding scientific ethics, patient dignity, and rigorous academic standards under the aegis of North Bengal Medical College.
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-950 text-base">
                  1. Originality of Scientific Research & Abstracts
                </h4>
                <p>
                  All papers, clinical audits, posters, and Med-Tech prototypes submitted to NUMESCON 2026 must be genuine student contributions conducted with appropriate Institutional Ethics Committee (IEC) clearance where human subjects or clinical records are involved.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  2. Zero Tolerance for Plagiarism & Data Falsification
                </h4>
                <p>
                  Abstracts undergo mandatory turnitin/plagiarism checks. Fabrication of clinical figures, image manipulation, or uncredited reproduction of previously published trials will result in instant disqualification and reporting to the delegate&apos;s home university.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  3. Fair Play in Competitions
                </h4>
                <p>
                  During the Med-Tech Innovation Pitch, Great Academic Debate, and Grand Medical Quiz Finals, the use of unapproved electronic aids, smart glasses, or external prompters is strictly banned. The Scientific Jury&apos;s decision is definitive and binding on all participating institutions.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  4. Simulator & Wet Lab Respect
                </h4>
                <p>
                  Delegates working in surgical simulator suites, airway mannequins, and animal tissue dry/wet labs must handle precision instruments with care and observe all Biomedical Waste Management Rules (BMW 2016).
                </p>
              </div>
            </>
          )}

          {/* CAMPUS SAFETY & HOSPITAL PROTOCOL */}
          {activePolicy === 'safety' && (
            <>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <strong className="block text-amber-950 font-serif text-base mb-1">
                  Active Tertiary Hospital Protocol:
                </strong>
                <span className="text-slate-700 text-sm">
                  North Bengal Medical College Hospital is a high-volume healthcare institution serving north-eastern India. Patient welfare and campus tranquility remain paramount.
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-950 text-base">
                  1. Hospital Zone Quietness & Movement Discipline
                </h4>
                <p>
                  Fest activities are confined to the Academic Complex, Rabindra Mancha Auditorium, and designated Skill Pavilions. Delegates are strictly prohibited from wandering into inpatient wards, ICUs, labor rooms, and emergency triage corridors without faculty accompaniment.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  2. Mandatory Badge Display & Campus Security
                </h4>
                <p>
                  Your physical/digital NUMESCON 2026 Delegate Badge must be visibly worn throughout the NBMC campus. Security personnel at Gate 1, Gate 2, and the Hostel Entrances are instructed to deny admission without verified credentials.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  3. Statutory Anti-Ragging Mandate
                </h4>
                <p>
                  North Bengal Medical College enforces zero tolerance towards ragging in any form, in strict compliance with the Supreme Court of India directives and National Medical Commission (NMC) regulations. Any misconduct will attract immediate legal action and campus expulsion.
                </p>

                <h4 className="font-bold text-slate-950 text-base">
                  4. Hostel Curfew & 24/7 Emergency Medical Support
                </h4>
                <p>
                  Visiting delegates accommodated in NBMC campus hostels must adhere to the 10:00 PM entry curfew. Free 24/7 emergency medical assistance is available at the NBMC Casualty & Trauma Center (Contact: +91 353 258 5478).
                </p>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Building2 className="w-4 h-4 text-blue-900" />
            <span>North Bengal Medical College · Sushrutanagar</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
