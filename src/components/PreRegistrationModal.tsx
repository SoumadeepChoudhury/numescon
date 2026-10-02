import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, Printer, Sparkles, Building2, Stethoscope } from 'lucide-react';

interface PreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAbstractInterest?: boolean;
}

interface RegistrationRecord {
  regNumber: string;
  name: string;
  email: string;
  institution: string;
  role: string;
  specialty: string;
  abstractInterest: boolean;
  registeredAt: string;
}

export default function PreRegistrationModal({
  isOpen,
  onClose,
  defaultAbstractInterest = false,
}: PreRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'Resident Physician / Registrar',
    specialty: 'Internal Medicine & Therapeutics',
    abstractInterest: defaultAbstractInterest,
  });

  const [submittedRecord, setSubmittedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid medical/professional email address.';
    }
    if (!formData.institution.trim()) errs.institution = 'Please state your hospital or medical institution.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRecord: RegistrationRecord = {
      regNumber: `NUM-2026-${randomSuffix}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      institution: formData.institution.trim(),
      role: formData.role,
      specialty: formData.specialty,
      abstractInterest: formData.abstractInterest,
      registeredAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setSubmittedRecord(newRecord);
  };

  const handleCopyReg = () => {
    if (!submittedRecord) return;
    navigator.clipboard.writeText(submittedRecord.regNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setFormData({
      name: '',
      email: '',
      institution: '',
      role: 'Resident Physician / Registrar',
      specialty: 'Internal Medicine & Therapeutics',
      abstractInterest: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl my-8 bg-[#FAFBF9] rounded-2xl border border-[#D5E4E0] shadow-2xl p-6 sm:p-8 text-[#1E2E2B]"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#6D8A83] hover:text-[#1E2E2B] hover:bg-[#EAF2EF] transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedRecord ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E2EDE9] flex items-center justify-center text-[#2D6A5F] border border-[#C6DFD7]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#183933] font-serif">
                  Priority Delegate Notification
                </h3>
                <p className="text-xs text-[#5D7E77]">Advance reservation for NUMESCON 2026</p>
              </div>
            </div>

            <p className="text-xs text-[#48665F] leading-relaxed mb-6">
              Join the official advance registry to secure early-bird delegate quotas, receive keynote faculty previews, and gain priority submission windows for clinical papers and abstracts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#294B43] mb-1">
                  Full Name & Credentials <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Julian Vance, M.D. / Candidate"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#183933] placeholder:text-[#8AA49E] focus:outline-none focus:ring-2 focus:ring-[#2D6A5F]/20 focus:border-[#2D6A5F] transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#D5E5E0]'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#294B43] mb-1">
                    Professional Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="physician@hospital.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#183933] placeholder:text-[#8AA49E] focus:outline-none focus:ring-2 focus:ring-[#2D6A5F]/20 focus:border-[#2D6A5F] transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#D5E5E0]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#294B43] mb-1">
                    Institution / University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St. Jude Hospital / Medical College"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#183933] placeholder:text-[#8AA49E] focus:outline-none focus:ring-2 focus:ring-[#2D6A5F]/20 focus:border-[#2D6A5F] transition-all ${
                      errors.institution ? 'border-red-400 bg-red-50/20' : 'border-[#D5E5E0]'
                    }`}
                  />
                  {errors.institution && <p className="text-[11px] text-red-600 mt-1">{errors.institution}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#294B43] mb-1">
                    Professional Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E5E0] bg-white text-sm text-[#183933] focus:outline-none focus:ring-2 focus:ring-[#2D6A5F]/20 focus:border-[#2D6A5F] transition-all"
                  >
                    <option value="Consultant / Specialist">Consultant / Attending Physician</option>
                    <option value="Surgeon / Proceduralist">Surgeon / Proceduralist</option>
                    <option value="Resident Physician / Registrar">Resident Physician / Registrar</option>
                    <option value="Medical Student / Intern">Medical Student / Intern</option>
                    <option value="Clinical Fellow / Postdoc">Clinical Fellow / Postdoctoral Researcher</option>
                    <option value="Allied Health Professional">Allied Health Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#294B43] mb-1">
                    Primary Academic Discipline
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E5E0] bg-white text-sm text-[#183933] focus:outline-none focus:ring-2 focus:ring-[#2D6A5F]/20 focus:border-[#2D6A5F] transition-all"
                  >
                    <option value="Internal Medicine & Therapeutics">Internal Medicine & Therapeutics</option>
                    <option value="Surgery & Operative Care">Surgery & Operative Care</option>
                    <option value="Pediatrics & Child Health">Pediatrics & Neonatal Care</option>
                    <option value="Cardiology & Critical Care">Cardiology & Critical Care</option>
                    <option value="Oncology & Precision Genomics">Oncology & Precision Medicine</option>
                    <option value="Neurology & Neuroscience">Neurology & Neurosurgery</option>
                    <option value="Preventive & Global Health">Preventive Medicine & Public Health</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#39564F]">
                  <input
                    type="checkbox"
                    checked={formData.abstractInterest}
                    onChange={(e) => setFormData({ ...formData, abstractInterest: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#2D6A5F] border-[#C4D7D1] focus:ring-[#2D6A5F]"
                  />
                  <span>
                    <strong>Call for Abstracts alert:</strong> Notify me immediately when the scientific abstract & poster submission portal opens (Tentative: June 2026).
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#2D6A5F] hover:bg-[#22554C] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Reserve Priority Notice & Delegate Pass</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-[#1C5248]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#15342E]">
                Advance Priority Pass Issued
              </h3>
              <p className="text-xs text-[#53766E]">
                Thank you, Dr./Scholar {submittedRecord.name}. Your advance notice priority is recorded.
              </p>
            </div>

            {/* Simulated Medical Delegate Pass Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#CDDFD9] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A5F]/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E7EFEA]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#2D6A5F] font-semibold">Official Advance Notice Pass</span>
                  <div className="text-lg font-serif font-bold text-[#14302A]">NUMESCON 2026</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#718C85] block">Reference</span>
                  <div className="font-mono font-bold text-[#1F544A] text-sm">{submittedRecord.regNumber}</div>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div>
                  <span className="text-[11px] text-[#718C85] block">Delegate</span>
                  <div className="font-medium text-[#14302A] text-sm">{submittedRecord.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#718C85] block">Role & Discipline</span>
                    <div className="text-[#20443D] font-medium">{submittedRecord.role}</div>
                    <div className="text-[#597871] text-[11px]">{submittedRecord.specialty}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718C85] block">Affiliation</span>
                    <div className="text-[#20443D] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#2D6A5F] shrink-0" />
                      <span className="truncate">{submittedRecord.institution}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EEF4F0] flex items-center justify-between text-xs text-[#3B5B53]">
                  <span>Tentative Dates: <strong>1st & 2nd Dec 2026</strong></span>
                  <span className="text-[#2D6A5F] font-medium">Priority Tier 1</span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-2 flex items-center justify-between border-t border-dashed border-[#DFEAE4]">
                <div className="flex items-center gap-1 tracking-widest text-[#718C85] font-mono text-[10px]">
                  ||| | |||| | ||||| || | ||| |||| | |||
                </div>
                <span className="text-[10px] text-[#718C85]">Verified Record</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyReg}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#CFDFD9] bg-white hover:bg-[#F2F7F4] text-xs font-medium text-[#20473F] flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#2D6A5F]" />}
                <span>{copied ? 'Copied Number' : 'Copy Reference #'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#CFDFD9] bg-white hover:bg-[#F2F7F4] text-xs font-medium text-[#20473F] flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-[#2D6A5F]" />
                <span>Print / Save Pass</span>
              </button>

              <button
                onClick={resetForm}
                className="py-2.5 px-4 rounded-xl bg-[#2D6A5F] hover:bg-[#204F47] text-white text-xs font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
