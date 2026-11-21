'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  CheckCircle2,
  Printer,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Award,
  ArrowRight,
  ChevronLeft,
  Upload,
  Copy,
  Check,
  AlertCircle,
  X,
  Image as ImageIcon,
  CreditCard,
} from 'lucide-react';
import { CLUSTERS, ClusterId } from '@/data/conferenceData';
import { DEFAULT_PAYMENT_CONFIG, PaymentQrConfig } from '@/lib/store';
import {
  compressImageInBrowser,
  compressImageToDataUrl,
  formatBytes,
} from '@/lib/clientMediaCompression';

interface RegistrationData {
  title: string;
  fullName: string;
  collegeName: string;
  rollNumber: string;
  admissionYear: string;
  academicBatch: string;
  academicLevel: string;
  email: string;
  phone: string;
  gender: string;
  state: string;
  city: string;
  foodPreference: string;
  clusterId: ClusterId;
  paymentTransactionId: string;
  paymentReceiptUrl: string;
  paymentReceiptName: string;
}

interface ConfirmedPass {
  delegateId: string;
  registrationDate: string;
  data: RegistrationData;
}

interface RegistrationSectionProps {
  initialClusterId?: ClusterId;
  onPassGenerated?: (pass: ConfirmedPass) => void;
  onOpenPolicy?: (type: 'terms' | 'integrity' | 'safety') => void;
}

export default function RegistrationSection({
  initialClusterId = 'A',
  onPassGenerated,
  onOpenPolicy,
}: RegistrationSectionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentConfig, setPaymentConfig] = useState<PaymentQrConfig>(DEFAULT_PAYMENT_CONFIG);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [receiptCompressionInfo, setReceiptCompressionInfo] = useState<string | null>(null);
  const [receiptPreviewModal, setReceiptPreviewModal] = useState(false);
  const [loadingPaymentConfig, setLoadingPaymentConfig] = useState(true);
  const [qrLoadError, setQrLoadError] = useState(false);


  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin-data')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setPaymentConfig({
          paymentQrUrl: data.paymentQrUrl ?? DEFAULT_PAYMENT_CONFIG.paymentQrUrl,
          paymentUpiId: data.paymentUpiId ?? DEFAULT_PAYMENT_CONFIG.paymentUpiId,
          paymentAccountName:
            data.paymentAccountName ?? DEFAULT_PAYMENT_CONFIG.paymentAccountName,
        });
        setLoadingPaymentConfig(false);
        setQrLoadError(false);
      })
      .catch((err) => console.error('Failed to fetch payment QR config:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const [confirmedPass, setConfirmedPass] = useState<ConfirmedPass | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('numescon_2026_pass');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [formData, setFormData] = useState<RegistrationData>({
    title: 'Mr.',
    fullName: '',
    collegeName: '',
    rollNumber: '',
    admissionYear: '2023',
    academicBatch: 'Batch 2023',
    academicLevel: '3rd Year MBBS / Health Sciences',
    email: '',
    phone: '',
    gender: 'Male',
    state: 'West Bengal',
    city: 'Siliguri',
    foodPreference: 'Vegetarian',
    clusterId: initialClusterId,
    paymentTransactionId: '',
    paymentReceiptUrl: '',
    paymentReceiptName: '',
  });

  const handleClusterSelect = (cId: ClusterId) => {
    setFormData((prev) => ({
      ...prev,
      clusterId: cId,
      selectedWorkshopIds: CLUSTERS[cId].workshops.map((w) => w.id),
    }));
    setFormErrors((prev) => {
      if (!prev.cluster) return prev;
      const next = { ...prev };
      delete next.cluster;
      return next;
    });
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full Name is required.';
      if (!formData.collegeName.trim()) errors.collegeName = 'College / University name is required.';
      if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number or College ID is required.';
      if (!formData.admissionYear) errors.admissionYear = 'Year of admission is required.';
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Mobile number is required.';
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!formData.city.trim()) errors.city = 'City is required.';
    }

    if (step === 3) {
      if (!CLUSTERS[formData.clusterId]) {
        errors.cluster = 'Please select a workshop cluster to proceed.';
      }
    }

    if (step === 4) {
      if (!formData.paymentTransactionId.trim()) {
        errors.paymentTransactionId = 'UPI Transaction ID / UTR number is required.';
      } else if (formData.paymentTransactionId.trim().length < 6) {
        errors.paymentTransactionId = 'Please enter a valid UPI Transaction ID / UTR number.';
      }
      if (!formData.paymentReceiptUrl) {
        errors.paymentReceipt =
          'Payment receipt screenshot is mandatory. Upload your payment screenshot to proceed.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({
        ...prev,
        paymentReceipt: 'Please upload a valid image screenshot (PNG, JPG, or WebP).',
      }));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        paymentReceipt: 'File is too large. Please upload a screenshot smaller than 20 MB.',
      }));
      return;
    }
    setIsProcessingReceipt(true);
    try {
      const browserCompressed = await compressImageInBrowser(file, 'receipts');
      const fd = new FormData();
      fd.append('file', browserCompressed.file);
      fd.append('bucket', 'receipts');
      fd.append('originalSize', String(browserCompressed.originalBytes));
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      let storedUrl = res.ok && data.url ? (data.url as string) : '';
      let finalBytes =
        res.ok && typeof data.compressedBytes === 'number'
          ? data.compressedBytes
          : browserCompressed.compressedBytes;
      let savedPct =
        res.ok && typeof data.savedPercent === 'number'
          ? data.savedPercent
          : browserCompressed.savedPercent;

      if (!storedUrl) {
        storedUrl = await compressImageToDataUrl(file, 'receipts');
        finalBytes = browserCompressed.compressedBytes;
        savedPct = browserCompressed.savedPercent;
      }

      setFormData((prev) => ({
        ...prev,
        paymentReceiptUrl: storedUrl,
        paymentReceiptName: browserCompressed.file.name,
      }));
      // setReceiptCompressionInfo(
      //   savedPct > 0
      //     ? `Compressed: ${formatBytes(browserCompressed.originalBytes)} → ${formatBytes(finalBytes)} (${savedPct}% saved)`
      //     : `Optimized WebP · ${formatBytes(finalBytes)}`
      // );
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.paymentReceipt;
        return next;
      });
    } catch {
      try {
        const compressedDataUrl = await compressImageToDataUrl(file, 'receipts');
        setFormData((prev) => ({
          ...prev,
          paymentReceiptUrl: compressedDataUrl,
          paymentReceiptName: file.name,
        }));
        setReceiptCompressionInfo('Compressed for storage');
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.paymentReceipt;
          return next;
        });
      } catch {
        setFormErrors((prev) => ({
          ...prev,
          paymentReceipt: 'Unable to read this screenshot image. Please try another file.',
        }));
      }
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handleCopyUpi = () => {
    const upiId = paymentConfig?.paymentUpiId;
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      const el = document.getElementById('registration');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `NUMES-2026-${formData.clusterId}${randomSuffix}`;
    const regDateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const fullClusterWorkshopIds = CLUSTERS[formData.clusterId].workshops.map((w) => w.id);
    const normalizedData: RegistrationData = {
      ...formData,
    };

    const newPass: ConfirmedPass = {
      delegateId: generatedId,
      registrationDate: regDateStr,
      data: normalizedData,
    };

    try {
      localStorage.setItem('numescon_2026_pass', JSON.stringify(newPass));
      const existingRaw = localStorage.getItem('numescon_2026_registrations');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const record = {
        delegateId: generatedId,
        registrationDate: regDateStr,
        ...normalizedData,
      };
      localStorage.setItem(
        'numescon_2026_registrations',
        JSON.stringify([record, ...existingList])
      );
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_registration',
          registration: record,
        }),
      }).catch((err) => console.error('Failed to sync registration:', err));
      const result = await res?.json();
      if (!res?.ok) {
        console.error('Supabase registration error:', result.error);
        alert(`Registration failed: ${result.error || 'Server error'}`);
        return;
      }

      setConfirmedPass(newPass);

    } catch (err) {
      console.error(err);
    }
    if (onPassGenerated) onPassGenerated(newPass);
  };

  const resetFormForNewDelegate = () => {
    try {
      localStorage.removeItem('numescon_2026_pass');
    } catch (e) {
      console.error(e);
    }
    setConfirmedPass(null);
    setCurrentStep(1);
    setFormErrors({});
    setReceiptCompressionInfo(null);
    setFormData({
      title: 'Mr.',
      fullName: '',
      collegeName: '',
      rollNumber: '',
      admissionYear: '2023',
      academicBatch: 'Batch 2023',
      academicLevel: '3rd Year MBBS / Health Sciences',
      email: '',
      phone: '',
      gender: 'Male',
      state: 'West Bengal',
      city: 'Siliguri',
      foodPreference: 'Vegetarian',
      clusterId: 'A',
      paymentTransactionId: '',
      paymentReceiptUrl: '',
      paymentReceiptName: '',
    });
  };

  const handlePrintBadge = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const chosenCluster = CLUSTERS[formData.clusterId] || CLUSTERS.A;

  // If already registered and has confirmed pass, show the official digital badge & pass view!
  if (confirmedPass) {
    const passData = confirmedPass.data;
    const passCluster = CLUSTERS[passData.clusterId] || CLUSTERS.A;

    return (
      <section id="registration" className="py-24 sm:py-32 bg-slate-100/60 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-sm font-bold mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workshop Registration Confirmed · Cluster Pass Active</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-950">
              Welcome, {passData.fullName}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 max-w-xl mx-auto">
              Your hands-on workshop cluster registration for NUMESCON 2026 at North Bengal Medical College &amp; Hospital (NBMC&amp;H) is confirmed. Present this digital workshop pass at the Skills Lab Desk on 28 &amp; 29 November 2026.
            </p>
          </div>

          {/* Luxury Digital Credential Card */}
          <div id="printable-pass" className="bg-white border-2 border-slate-950 rounded-3xl shadow-lg overflow-hidden relative print:border-none print:shadow-none">

            {/* Top Security Header Strip */}
            <div className="bg-slate-950 text-white px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-serif font-black text-2xl shadow-sm">
                  N
                </div>
                <div>
                  <span className="block font-serif font-extrabold text-xl sm:text-2xl tracking-tight leading-none">
                    NUMESCON 2026 WORKSHOP PASS
                  </span>
                  <span className="block text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-1">
                    North Bengal Medical College &amp; Hospital · Practical Clusters · Nov 28 &amp; 29
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-base sm:text-lg font-mono font-bold text-amber-400">
                  {confirmedPass.delegateId}
                </span>
                <span className="block text-xs text-slate-400 mt-0.5">
                  Issued: {confirmedPass.registrationDate}
                </span>
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-8 sm:p-12 space-y-6">

              {/* Left Column: Delegate Details (8 Cols) */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Registered Delegate
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 leading-tight">
                    {passData.title} {passData.fullName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <span className="text-slate-500 font-medium block">College / University:</span>
                    <strong className="text-slate-900 text-base block">{passData.collegeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Roll / Institutional ID:</span>
                    <strong className="text-slate-900 text-base font-mono block">{passData.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Batch & Admission Year:</span>
                    <span className="font-semibold text-slate-800">{passData.academicBatch} (Adm. {passData.admissionYear})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Academic Status:</span>
                    <span className="font-semibold text-slate-800">{passData.academicLevel}</span>
                  </div>
                </div>

                {/* Assigned Cluster Banner */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
                    <span>Assigned Workshop Cluster</span>
                    <span>Cluster {passCluster.id}</span>
                  </div>
                  <div className="font-serif font-extrabold text-slate-950 text-xl">
                    {passCluster.title}
                  </div>
                  <div className="text-sm text-slate-600 mt-1.5">
                    Enrolled in all {passCluster.workshops.length} mandatory hands-on workshops (2 on Day 1 + 2 on Day 2) with personal workbench allocation.
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-blue-900 block mb-1">
                        Day 1 · 28 Nov
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {passCluster.workshops
                          .filter((w) => w.day === 1)
                          .map((ws) => (
                            <li key={ws.id} className="truncate">
                              • {ws.title}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                        Day 2 · 29 Nov
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {passCluster.workshops
                          .filter((w) => w.day === 2)
                          .map((ws) => (
                            <li key={ws.id} className="truncate">
                              • {ws.title}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Logistics & Payment Receipt Badges */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {/* <div className="bg-slate-100 px-3.5 py-1.5 rounded-lg text-slate-700">
                    Lodging: <strong className="text-slate-950">{passData.needAccommodation ? passData.accommodationType : 'Self Arranged'}</strong>
                  </div> */}
                  <div className="bg-slate-100 px-3.5 py-1.5 rounded-lg text-slate-700">
                    Lunch Preference: <strong className="text-slate-950">{passData.foodPreference}</strong>
                  </div>
                  {passData.paymentTransactionId && (
                    <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-lg text-emerald-900 font-medium">
                      Workshop Fee: <strong>₹300</strong> · Receipt Ref:{' '}
                      <strong className="font-mono">{passData.paymentTransactionId}</strong>
                    </div>
                  )}
                </div>
              </div>


            </div>

            {/* Bottom Security Footer */}
            <div className="bg-slate-100 px-8 py-4 border-t border-slate-200 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Authorized by Academic Council · North Bengal Medical College</span>
              </div>
              {/* <div className="font-mono text-xs text-slate-500 break-all">
                AUTH-KEY: NBMC-2026-{confirmedPass.delegateId.slice(-4)}-VALID
              </div> */}
            </div>

          </div>

          {/* Action Buttons for Badge */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrintBadge}
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-5 h-5" />
              <span>Print Official Badge (PDF)</span>
            </button>

            <button
              onClick={resetFormForNewDelegate}
              className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-base font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
              <span>Register Another Student for Workshops</span>
            </button>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-900 mb-3">
            <Ticket className="w-4 h-4" />
            <span>Practical Workshop Registration Only</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
            Register for Cluster Workshops
          </h2>
          <p className="mt-3 text-base sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
            Registration is required exclusively for the 3 hands-on workshop clusters (Dopamine Drive, Adrenaline Rush, and Serotonin Surge). Guest lectures and auditorium talks are open-entry and require no registration.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 px-5 py-2.5 bg-white border border-blue-200 rounded-2xl shadow-2xs text-sm text-slate-800">
            <span className="font-bold text-blue-900 uppercase tracking-wider text-xs">
              Workshop Registration Fee
            </span>
            <span aria-hidden="true" className="text-slate-300">
              |
            </span>
            <span className="font-serif text-xl font-extrabold text-slate-950">₹300</span>
            <span className="text-xs text-slate-600">
              per delegate (covers all 6 cluster workshops across 28 &amp; 29 Nov)
            </span>
          </div>
        </div>

        {/* Step Progress Tracker with Large Touch Targets (5 Steps) */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${currentStep === 1
                ? 'bg-blue-900 text-white shadow-sm'
                : currentStep > 1
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="block text-[11px] uppercase tracking-wider opacity-75">Step 1</span>
              <span className="truncate block mt-0.5">Identity</span>
            </button>

            <button
              type="button"
              onClick={() => validateStep(1) && setCurrentStep(2)}
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${currentStep === 2
                ? 'bg-blue-900 text-white shadow-sm'
                : currentStep > 2
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="block text-[11px] uppercase tracking-wider opacity-75">Step 2</span>
              <span className="truncate block mt-0.5">Contact &amp; Stay</span>
            </button>

            <button
              type="button"
              onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(3)}
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${currentStep === 3
                ? 'bg-blue-900 text-white shadow-sm'
                : currentStep > 3
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="block text-[11px] uppercase tracking-wider opacity-75">Step 3</span>
              <span className="truncate block mt-0.5">Cluster (A–C)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                validateStep(1) && validateStep(2) && validateStep(3) && setCurrentStep(4)
              }
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${currentStep === 4
                ? 'bg-blue-900 text-white shadow-sm'
                : currentStep > 4
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="block text-[11px] uppercase tracking-wider opacity-75">Step 4</span>
              <span className="truncate block mt-0.5">Pay ₹300 &amp; QR</span>
            </button>

            <button
              type="button"
              onClick={() =>
                validateStep(1) &&
                validateStep(2) &&
                validateStep(3) &&
                validateStep(4) &&
                setCurrentStep(5)
              }
              className={`col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${currentStep === 5
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="block text-[11px] uppercase tracking-wider opacity-75">Step 5</span>
              <span className="truncate block mt-0.5">Confirm &amp; Pass</span>
            </button>
          </div>
        </div>

        {/* The Form Card with Generous Padding */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">

          <form onSubmit={handleSubmitRegistration}>

            {/* STEP 1: Academic Identity */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Step 1: Academic & Institutional Information
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Your name and college details will appear on your official certificate and badge.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Title
                    </label>
                    <select
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Mx.">Mx.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Raj Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3.5 text-base bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.fullName ? 'border-rose-500' : 'border-slate-300'
                        }`}
                    />
                    {formErrors.fullName && (
                      <span className="text-sm text-rose-600 mt-1.5 block">{formErrors.fullName}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    College / Medical Institution / University Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maulana Azad Medical College / Apex Health Institute"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className={`w-full px-4 py-3.5 text-base bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.collegeName ? 'border-rose-500' : 'border-slate-300'
                      }`}
                  />
                  {formErrors.collegeName && (
                    <span className="text-sm text-rose-600 mt-1.5 block">{formErrors.collegeName}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Roll Number / ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023-MBBS-042"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className={`w-full px-4 py-3.5 text-base bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.rollNumber ? 'border-rose-500' : 'border-slate-300'
                        }`}
                    />
                    {formErrors.rollNumber && (
                      <span className="text-sm text-rose-600 mt-1.5 block">{formErrors.rollNumber}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Academic Batch <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.academicBatch}
                      onChange={(e) => setFormData({ ...formData, academicBatch: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    >
                      <option value="Batch 2021">Batch 2021</option>
                      <option value="Batch 2022">Batch 2022</option>
                      <option value="Batch 2023">Batch 2023</option>
                      <option value="Batch 2024">Batch 2024</option>
                      <option value="Batch 2025">Batch 2025</option>
                      <option value="Batch 2026">Batch 2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Year of Admission <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="2018"
                      max="2026"
                      value={formData.admissionYear}
                      onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Current Academic Year / Degree Standing
                  </label>
                  <select
                    value={formData.academicLevel}
                    onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                    className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="1st Year Undergraduate">1st Year Undergraduate (Foundation)</option>
                    <option value="2nd Year Undergraduate">2nd Year Undergraduate (Para-Clinical)</option>
                    <option value="3rd Year MBBS / Health Sciences">3rd Year (Part I Clinicals)</option>
                    <option value="Final Year MBBS / Health Sciences">Final Year (Part II Surgery/Med/OBG)</option>
                    <option value="Compulsory Rotatory Medical Intern">Compulsory Rotatory Medical Intern</option>
                    <option value="Post-Graduate / Junior Resident">Post-Graduate / Junior Resident</option>
                  </select>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Continue to Logistics</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Contact & Stay */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Step 2: Contact, Accommodation & Dietary Needs
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Your workshop venue allocations and digital entry codes will be sent to your email and phone.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="delegate@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3.5 text-base bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.email ? 'border-rose-500' : 'border-slate-300'
                        }`}
                    />
                    {formErrors.email && (
                      <span className="text-sm text-rose-600 mt-1.5 block">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3.5 text-base bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.phone ? 'border-rose-500' : 'border-slate-300'
                        }`}
                    />
                    {formErrors.phone && (
                      <span className="text-sm text-rose-600 mt-1.5 block">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      City of Residence <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Chandigarh"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra, Karnataka"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                {/* Accommodation Selection */}
                {/* <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <strong className="text-base text-slate-900 block">
                        Campus Hostel / Guest House Accommodation
                      </strong>
                      <span className="text-sm text-slate-600 block mt-0.5">
                        Do you require on-campus lodging for the 2 fest days (Nov 28 & 29, 2026) at NBMC&H Sushrutanagar?
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needAccommodation: false })}
                        className={`px-5 py-2.5 text-sm rounded-xl font-bold transition-all cursor-pointer ${!formData.needAccommodation
                            ? 'bg-slate-950 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-300'
                          }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needAccommodation: true })}
                        className={`px-5 py-2.5 text-sm rounded-xl font-bold transition-all cursor-pointer ${formData.needAccommodation
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-300'
                          }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  {formData.needAccommodation && (
                    <div className="pt-4 border-t border-slate-200">
                      <label className="block text-sm font-bold text-slate-800 mb-2">
                        Select Lodging Option:
                      </label>
                      <select
                        value={formData.accommodationType}
                        onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                        className="w-full px-4 py-3.5 text-base bg-white border border-slate-300 rounded-xl"
                      >
                        <option value="Hostel Shared Room (Twin/Triple Sharing)">
                          Hostel Shared Room (Twin/Triple Sharing with WiFi & Hot Water)
                        </option>
                        <option value="Academic Guest House (Air Conditioned Room)">
                          Academic Guest House (Air Conditioned Room with En-suite)
                        </option>
                        <option value="Partner Hotel Suite (Off-campus Shuttle Provided)">
                          Partner Hotel Suite (Off-campus Shuttle Provided)
                        </option>
                      </select>
                    </div>
                  )}
                </div> */}

                {/* Dietary Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Catering & Dietary Preference (Included with registration)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    {['Vegetarian', 'Non-Vegetarian'].map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setFormData({ ...formData, foodPreference: diet })}
                        className={`p-3.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${formData.foodPreference === diet
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-950"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Step 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Choose Cluster Track</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Cluster Selection (A, B, C) & Fixed 2-Day Workshop Curriculum */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Step 3: Choose Your Workshop Cluster (A, B, or C)
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Select one cluster below. Enrolling in a cluster automatically enrolls you in all 4 mandatory workshops included in that cluster (2 on Day 1 and 2 on Day 2) — individual workshop selection is not available.
                  </p>
                </div>

                {/* 3 Large Cluster Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {(['A', 'B', 'C'] as const).map((cId) => {
                    const cl = CLUSTERS[cId];
                    const isSelected = formData.clusterId === cId;
                    return (
                      <button
                        key={cId}
                        type="button"
                        onClick={() => handleClusterSelect(cId)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm scale-[1.01]'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-amber-300' : 'text-blue-900'}`}>
                            CLUSTER {cId}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`block text-base sm:text-lg font-extrabold font-serif truncate ${isSelected ? 'text-white' : 'text-slate-950'}`}>
                          {cl.name}
                        </span>
                        <span className={`block text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          All 4 Workshops Included (2 Day 1 + 2 Day 2)
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Read-Only Included Workshops Schedule for Chosen Cluster */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                        Included Curriculum · Fixed Cluster Track
                      </span>
                      <h4 className="font-serif text-2xl font-extrabold text-slate-900">
                        {chosenCluster.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {chosenCluster.tagline}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900">
                      <CheckCircle2 className="w-4 h-4 text-blue-900 shrink-0" />
                      <span>All {chosenCluster.workshops.length} Workshops Mandatory</span>
                    </div>
                  </div>

                  <div className="my-4 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-blue-950">Cluster Enrollment Policy:</strong> Delegates enrolled in{' '}
                    <strong className="text-slate-950">Cluster {chosenCluster.id} ({chosenCluster.name})</strong>{' '}
                    attend all 4 hands-on sessions listed below across 28th &amp; 29th November 2026. Workshops cannot be added or removed individually.
                  </div>

                  {/* Day 1 Workshops (Read-Only List) */}
                  <div className="mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3">
                      Day 1 · 28 November 2026 (2 Mandatory Workshops · 4:00 – 7:00 PM)
                    </div>
                    <div className="space-y-3">
                      {chosenCluster.workshops
                        .filter((w) => w.day === 1)
                        .map((ws, idx) => (
                          <div
                            key={ws.id}
                            className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-start gap-4"
                          >
                            <div className="mt-0.5 w-8 h-8 rounded-xl bg-blue-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              0{idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-serif font-bold text-slate-950 text-base sm:text-lg">
                                  {ws.title}
                                </span>
                                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                                  {ws.timeSlot}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 mb-2">
                                {ws.subtitle}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="font-semibold text-slate-800">{ws.leadFaculty}</span>
                                  <span aria-hidden="true">·</span>
                                  {/* <span>{ws.hall}</span> */}
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Included in Cluster {chosenCluster.id}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Day 2 Workshops (Read-Only List) */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                      Day 2 · 29 November 2026 (2 Mandatory Practical Workshops)
                    </div>
                    <div className="space-y-3">
                      {chosenCluster.workshops
                        .filter((w) => w.day === 2)
                        .map((ws, idx) => (
                          <div
                            key={ws.id}
                            className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white flex items-start gap-4"
                          >
                            <div className="mt-0.5 w-8 h-8 rounded-xl bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              0{idx + 4}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-serif font-bold text-slate-950 text-base sm:text-lg">
                                  {ws.title}
                                </span>
                                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                                  {ws.timeSlot}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 mb-2">
                                {ws.subtitle}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="font-semibold text-slate-800">{ws.leadFaculty}</span>
                                  <span aria-hidden="true">·</span>
                                  {/* <span>{ws.hall}</span> */}
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Included in Cluster {chosenCluster.id}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {formErrors.cluster && (
                    <span className="text-sm text-rose-600 mt-3 block font-medium">{formErrors.cluster}</span>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-950"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Step 2</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Proceed to ₹300 Payment QR</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: QR Code Payment & Mandatory Receipt Screenshot Upload */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-200">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span>Mandatory Workshop Payment Verification · ₹300</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Step 4: Pay ₹300 via QR &amp; Upload Payment Receipt
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Scan the official NBMC&amp;H UPI QR code below and pay <strong className="text-slate-950">₹300</strong> for your workshop cluster registration, then upload the payment confirmation screenshot and enter your UTR / Transaction ID. Registration is accepted only after receipt upload.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Official Payment QR Card (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-6 text-center flex flex-col items-center">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                      Official NBMC&amp;H UPI QR
                    </span>
                    <span className="text-sm font-serif font-bold text-white leading-snug mb-3">
                      {paymentConfig?.paymentAccountName || 'NUMESCON 2026 Workshop Committee · NBMC&H'}
                    </span>

                    {/* Exact Fee Callout */}
                    <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-amber-200">
                        Amount Payable
                      </span>
                      <span className="font-serif text-2xl font-extrabold text-amber-300 leading-none">
                        ₹300
                      </span>
                    </div>

                    {/* Uploaded Supabase QR Code */}
                    <div className="w-60 h-60 bg-white rounded-2xl p-3 shadow-lg flex items-center justify-center border-2 border-amber-400/40 overflow-hidden">
                      {loadingPaymentConfig ? (
                        <div className="w-full h-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-xs font-medium text-slate-400">
                          Loading QR...
                        </div>
                      ) : paymentConfig?.paymentQrUrl && !qrLoadError ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={paymentConfig.paymentQrUrl}
                          alt="Official NUMESCON 2026 Workshop Payment QR Code"
                          referrerPolicy="no-referrer"
                          onError={() => setQrLoadError(true)}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="px-4 text-center text-xs text-slate-500 leading-relaxed">
                          QR image unavailable. Please pay using the official UPI ID below.
                        </div>
                      )}
                    </div>

                    {/* Copyable UPI ID Box */}
                    <div className="mt-4 w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                      <div className="text-left min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                          UPI ID
                        </span>
                        <span className="block font-mono text-xs text-white font-bold truncate">
                          {loadingPaymentConfig
                            ? 'Loading...'
                            : paymentConfig?.paymentUpiId || 'Unavailable'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        disabled={!paymentConfig?.paymentUpiId}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Works with Google Pay, PhonePe, Paytm, BHIM UPI &amp; all major banking apps. Pay exactly{' '}
                      <strong className="text-white">₹300</strong> for{' '}
                      <strong className="text-amber-300">
                        Cluster {chosenCluster.id} ({chosenCluster.name})
                      </strong>
                      .
                    </p>
                  </div>

                  {/* Right: Upload Payment Receipt & UTR Reference (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Mandatory ₹300 Payment &amp; Verification:</strong> A flat registration fee of <strong>₹300</strong> must be paid for workshop enrollment. Your registration will only be accepted once you pay ₹300 and upload a clear screenshot of the payment receipt showing the amount (₹300) and Transaction / UTR ID.
                      </p>
                    </div>

                    {/* Transaction / UTR ID Input */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">
                        UPI Transaction ID / UTR Reference Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 432510984512 or T261128143025..."
                        value={formData.paymentTransactionId}
                        onChange={(e) => {
                          setFormData({ ...formData, paymentTransactionId: e.target.value });
                          if (formErrors.paymentTransactionId) {
                            setFormErrors((prev) => {
                              const next = { ...prev };
                              delete next.paymentTransactionId;
                              return next;
                            });
                          }
                        }}
                        className={`w-full px-4 py-3.5 text-base font-mono bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 ${formErrors.paymentTransactionId ? 'border-rose-500' : 'border-slate-300'
                          }`}
                      />
                      {formErrors.paymentTransactionId && (
                        <span className="text-sm text-rose-600 mt-1.5 block font-medium">
                          {formErrors.paymentTransactionId}
                        </span>
                      )}
                    </div>

                    {/* Receipt Screenshot Dropzone / Preview */}
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">
                        Upload Payment Receipt Screenshot (PNG / JPG / WebP){' '}
                        <span className="text-rose-500">*</span>
                      </label>

                      {!formData.paymentReceiptUrl ? (
                        <label
                          className={`flex flex-col items-center justify-center gap-2.5 w-full p-7 sm:p-8 border-2 border-dashed rounded-2xl bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer text-center ${formErrors.paymentReceipt
                            ? 'border-rose-400 bg-rose-50/40'
                            : 'border-slate-300 hover:border-blue-900'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="block text-sm sm:text-base font-bold text-slate-900">
                              {isProcessingReceipt
                                ? 'Compressing & uploading receipt screenshot...'
                                : 'Click to upload payment receipt screenshot'}
                            </span>
                            <span className="block text-xs text-slate-500 mt-1">
                              Upload GPay / PhonePe / Paytm / Bank confirmation image (auto-compressed to crisp WebP)
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptFileChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="border-2 border-emerald-300 bg-emerald-50/50 rounded-2xl p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setReceiptPreviewModal(true)}
                              className="w-24 h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                              title="Click to inspect full screenshot"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={formData.paymentReceiptUrl}
                                alt="Uploaded payment receipt preview"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Receipt Screenshot Attached</span>
                              </div>
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {formData.paymentReceiptName || 'payment_receipt.webp'}
                              </p>
                              {receiptCompressionInfo && (
                                <p className="text-xs font-mono font-semibold text-emerald-800 mt-0.5">
                                  {receiptCompressionInfo}
                                </p>
                              )}
                              <p className="text-xs text-slate-600 mt-1">
                                Click the thumbnail to inspect your screenshot before submitting.
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 cursor-pointer transition-colors">
                                  <Upload className="w-3.5 h-3.5 text-blue-900" />
                                  <span>Replace Screenshot</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleReceiptFileChange}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      paymentReceiptUrl: '',
                                      paymentReceiptName: '',
                                    }));
                                    setReceiptCompressionInfo(null);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {formErrors.paymentReceipt && (
                        <span className="text-sm text-rose-600 mt-2 block font-medium">
                          {formErrors.paymentReceipt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Step 3</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Review &amp; Confirm</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Generate Workshop Pass */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Step 5: Review &amp; Generate Workshop Pass
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Please verify your student details, chosen workshop cluster, and uploaded payment receipt before issuing your official workshop pass.
                  </p>
                </div>

                {/* Summary Card with Generous Typography */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5 border-b border-slate-200">
                    <div>
                      <span className="text-slate-500 font-medium block">Student Name:</span>
                      <strong className="text-slate-950 text-lg block">
                        {formData.title} {formData.fullName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">College / University:</span>
                      <strong className="text-slate-950 text-base block">
                        {formData.collegeName}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Roll Number / Batch:</span>
                      <span className="text-slate-800 font-semibold">
                        {formData.rollNumber} ({formData.academicBatch}, Adm. {formData.admissionYear})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Academic Level:</span>
                      <span className="text-slate-800 font-semibold">
                        {formData.academicLevel}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Contact Info:</span>
                      <span className="text-slate-800 font-semibold">
                        {formData.email} · {formData.phone}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Lunch Preferences:</span>
                      <span className="text-slate-800 font-semibold">
                        {formData.foodPreference}
                      </span>
                    </div>
                  </div>

                  {/* Selected Cluster Info */}
                  <div className="p-4 bg-white border border-blue-200 rounded-xl">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                      Assigned Workshop Cluster:
                    </span>
                    <strong className="font-serif text-lg sm:text-xl text-slate-950 block">
                      {chosenCluster.title}
                    </strong>
                    <span className="text-sm text-slate-600 block mt-1">
                      All {chosenCluster.workshops.length} mandatory workshops included across 28th &amp; 29th November 2026 (2 on Day 1 + 2 on Day 2).
                    </span>
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-blue-900 block mb-1">
                          Day 1 · 28 Nov
                        </span>
                        <ul className="space-y-1 text-slate-700">
                          {chosenCluster.workshops
                            .filter((w) => w.day === 1)
                            .map((ws) => (
                              <li key={ws.id}>• {ws.title}</li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                          Day 2 · 29 Nov
                        </span>
                        <ul className="space-y-1 text-slate-700">
                          {chosenCluster.workshops
                            .filter((w) => w.day === 2)
                            .map((ws) => (
                              <li key={ws.id}>• {ws.title}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Payment Receipt Verification Summary */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {formData.paymentReceiptUrl && (
                        <button
                          type="button"
                          onClick={() => setReceiptPreviewModal(true)}
                          className="w-14 h-16 rounded-lg overflow-hidden border border-emerald-300 bg-slate-950 shrink-0 cursor-pointer"
                          title="Click to enlarge receipt"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.paymentReceiptUrl}
                            alt="Uploaded payment receipt"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )}
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>₹300 Workshop Fee · Payment Receipt Uploaded</span>
                        </span>
                        <div className="text-sm font-bold text-slate-950 mt-0.5 font-mono">
                          UTR / Ref: {formData.paymentTransactionId}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {formData.paymentReceiptName || 'Payment screenshot attached'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReceiptPreviewModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold cursor-pointer self-start sm:self-center shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Inspect Receipt</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="academic_terms"
                      defaultChecked
                      required
                      className="mt-1 w-5 h-5 text-blue-900 rounded-md border-slate-300"
                    />
                    <label htmlFor="academic_terms" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                      I certify that the provided student credentials, payment transaction reference, and receipt screenshot are genuine. I agree to abide by the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenPolicy?.('terms');
                        }}
                        className="text-blue-900 underline font-semibold hover:text-blue-700 cursor-pointer"
                      >
                        Terms of Registration
                      </button>
                      ,{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenPolicy?.('integrity');
                        }}
                        className="text-blue-900 underline font-semibold hover:text-blue-700 cursor-pointer"
                      >
                        Academic Integrity Code
                      </button>
                      , and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenPolicy?.('safety');
                        }}
                        className="text-blue-900 underline font-semibold hover:text-blue-700 cursor-pointer"
                      >
                        Campus Safety Protocol
                      </button>{' '}
                      of North Bengal Medical College (NBMC).
                    </label>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>Issue Official Workshop Pass &amp; Badge</span>
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>

        {/* Receipt Screenshot Preview Modal */}
        {receiptPreviewModal && formData.paymentReceiptUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs"
            onClick={() => setReceiptPreviewModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <QrCode className="w-4 h-4" />
                  <span>UPLOADED PAYMENT RECEIPT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close receipt preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 bg-slate-900 overflow-y-auto flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.paymentReceiptUrl}
                  alt="Uploaded Payment Receipt Full Preview"
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
