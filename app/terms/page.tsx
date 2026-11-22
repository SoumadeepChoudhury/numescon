'use client';

import React from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    FileText,
    CreditCard,
    Users,
    Eye,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    Lock,
} from 'lucide-react';

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Top Header */}
            <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-serif font-black text-xl">
                            N
                        </div>
                        <div>
                            <span className="block font-serif font-extrabold text-base sm:text-lg tracking-tight leading-none">
                                NUMESCON 2026 · REGISTRATION TERMS
                            </span>
                            <span className="block text-xs text-slate-400 mt-1">
                                North Bengal Medical College &amp; Hospital (NBMC&amp;H), Sushrutanagar
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Portal</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 space-y-8">
                {/* Title Banner */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 mb-3">
                        <FileText className="w-4 h-4" />
                        <span>Official Policy · Effective for NUMESCON 2026</span>
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                        Terms &amp; Conditions of Workshop Registration
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                        By registering for the hands-on practical workshop clusters of{' '}
                        <strong className="text-slate-900">NUMESCON 2026</strong> (scheduled on{' '}
                        <strong className="text-slate-900">28 &amp; 29 November 2026</strong> at North Bengal
                        Medical College &amp; Hospital, Sushrutanagar), you agree to the following terms,
                        allotment rules, payment policies, and data handling practices.
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-blue-900" />
                            <span>Event Dates: 28 &amp; 29 November 2026</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Venue: NBMC&amp;H, Siliguri, West Bengal</span>
                        <span aria-hidden="true">·</span>
                        <span>Workshop Fee: ₹300 per delegate</span>
                    </div>
                </div>

                {/* Section 1: Registration Scope & Eligibility */}
                <section className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950">
                            1. Registration Scope &amp; Eligibility
                        </h2>
                    </div>
                    <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                        <li>
                            Online registration is required <strong>exclusively for the hands-on practical workshop clusters</strong>{' '}
                            (Cluster A: Dopamine Drive, Cluster B: Adrenaline Rush, and Cluster C: Serotonin Surge).
                            Guest lectures and auditorium talks are open-entry and do not require workshop registration.
                        </li>
                        <li>
                            <strong>One Registration Per Email:</strong> Each participant may register only once using
                            a valid, unique email address. Duplicate submissions using the same email address are not
                            permitted and may be removed by the Organizing Committee.
                        </li>
                        <li>
                            Delegates must provide accurate academic credentials (full legal name, institution/college
                            name, roll number/ID, batch, and academic standing), as these details are printed directly
                            on official workshop passes and certificates.
                        </li>
                    </ul>
                </section>

                {/* Section 2: Cluster Allotment & Seat Capacity */}
                <section className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950">
                            2. Cluster Allotment Policy (First Come, First Served)
                        </h2>
                    </div>
                    <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                        <li>
                            Each workshop cluster has a strict maximum capacity of <strong>50 participants</strong>,
                            allotted strictly on a <strong>First Come, First Served</strong> basis.
                        </li>
                        <li>
                            Once a cluster reaches full capacity, any additional delegates selecting that cluster may
                            be automatically re-allotted to another cluster with available seats, subject to availability.
                        </li>
                        <li>
                            <strong>Fixed Curriculum:</strong> Enrolling in a cluster automatically enrolls you in all
                            4 mandatory workshops included in that track (2 on Day 1 + 2 on Day 2). Individual
                            workshop swapping, partial attendance, or cross-cluster switching is not permitted.
                        </li>
                    </ul>
                </section>

                {/* Section 3: Payment, Verification & Refund Policy */}
                <section className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950">
                            3. Workshop Fee, Payment Verification &amp; Refunds
                        </h2>
                    </div>
                    <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                        <li>
                            A flat registration fee of <strong>₹300</strong> per delegate is payable via the official
                            NBMC&amp;H UPI QR code or UPI ID displayed during Step 4 of registration.
                        </li>
                        <li>
                            Uploading a clear payment confirmation screenshot showing the paid amount (₹300) and
                            transaction/UTR details is mandatory.
                        </li>
                        <li>
                            <strong>Manual Committee Audit:</strong> All registrations initially carry a{' '}
                            <em>Pending Review</em> status. Your seat and digital pass are subject to manual
                            verification by the Organizing Committee against bank/UPI statements. Fraudulent,
                            unclear, or mismatched receipts will be marked <em>Rejected</em> and the registration
                            cancelled.
                        </li>
                        <li>
                            <strong>Non-Refundable Fee:</strong> Workshop registration fees are non-refundable and
                            non-transferable once submitted, except in the event of official cancellation of the
                            workshop track by the Organizing Committee.
                        </li>
                    </ul>
                </section>

                {/* Section 4: Data Privacy & Visibility to the Committee */}
                <section className="bg-blue-50/60 border border-blue-200 rounded-3xl p-7 sm:p-9 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                            <Eye className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950">
                            4. Data Privacy &amp; Information Visibility
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                        By submitting the registration form, you explicitly consent to the collection, storage, and
                        internal use of your registration details by the{' '}
                        <strong>NUMESCON 2026 Organizing Committee &amp; Secretariat (NBMC&amp;H)</strong>:
                    </p>
                    <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                        <li>
                            <strong>Visible to Authorized Committee Members:</strong> Your full name, college/institution,
                            roll number, academic batch, <strong>email address</strong>,{' '}
                            <strong>mobile / WhatsApp number</strong>, dietary preference, assigned cluster, and
                            uploaded <strong>payment receipt screenshot</strong> are accessible to authorized Organizing
                            Committee administrators through the password-protected Admin Console.
                        </li>
                        <li>
                            <strong>Purpose of Use:</strong> Your email address and phone/WhatsApp number will be used
                            exclusively for payment verification follow-ups, workshop hall/workbench allocations,
                            schedule updates, digital pass verification, and certificate distribution.
                        </li>
                        <li>
                            <strong>Roster &amp; Storage:</strong> Registration records and uploaded receipts are stored
                            securely in our cloud database and storage buckets and may be exported (CSV) internally
                            for on-desk attendance verification, catering counts, and audit purposes.
                        </li>
                        <li>
                            <strong>No Commercial Sharing:</strong> Your contact information will not be sold or shared
                            with unauthorized third-party marketers.
                        </li>
                    </ul>
                </section>

                {/* Section 5: On-Campus Attendance, Passes & Conduct */}
                <section className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-9 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-950">
                            5. Workshop Pass, Catering &amp; Campus Conduct
                        </h2>
                    </div>
                    <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                        <li>
                            Delegates must present their official NUMESCON 2026 Digital/Printed Workshop Pass along
                            with a valid college ID card at the Skills Lab Desk on 28 &amp; 29 November 2026.
                        </li>
                        <li>
                            Lunch catering preferences (Vegetarian / Non-Vegetarian) selected during registration will
                            be honored based on confirmed delegate rosters.
                        </li>
                        <li>
                            All delegates must adhere to the Academic Integrity Code and Campus Safety Protocol of
                            North Bengal Medical College &amp; Hospital, including respectful handling of clinical
                            simulators, mannequins, and laboratory equipment.
                        </li>
                        <li>
                            The Organizing Committee reserves the right to modify workshop timings, venues, or faculty
                            assignments if required due to institutional or clinical contingencies.
                        </li>
                    </ul>
                </section>

                {/* Bottom Confirmation Box */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <strong className="text-white block">Questions or Corrections?</strong>
                            If you entered an incorrect email, phone number, or uploaded the wrong receipt, please
                            contact the NUMESCON 2026 Organizing Committee Secretariat directly for manual assistance.
                        </div>
                    </div>

                    <Link
                        href="/#registration"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0"
                    >
                        <Lock className="w-4 h-4" />
                        <span>Return to Registration</span>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
                NUMESCON 2026 · North Bengal Medical College &amp; Hospital (NBMC&amp;H), Sushrutanagar
            </footer>
        </main>
    );
}