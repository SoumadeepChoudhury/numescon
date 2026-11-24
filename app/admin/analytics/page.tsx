'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    BarChart3,
    Users,
    IndianRupee,
    Building2,
    Utensils,
    ShieldCheck,
    MapPin,
    GraduationCap,
    Calendar,
    Printer,
    RefreshCw,
} from 'lucide-react';
import {
    StudentRegistrationRecord,
    PaymentVerificationStatus,
} from '@/lib/store';
import { CLUSTERS, ClusterId } from '@/data/conferenceData';

const WORKSHOP_FEE = 300;
const CLUSTER_CAPACITY: Record<ClusterId, number> = {
    A: 30,
    B: 30,
    C: 50,
};
const TOTAL_SEATS = Object.values(CLUSTER_CAPACITY).reduce((sum, n) => sum + n, 0);

interface CountItem {
    label: string;
    count: number;
    pct: number;
}

function groupAndCount(
    items: StudentRegistrationRecord[],
    extractor: (r: StudentRegistrationRecord) => string
): CountItem[] {
    const total = items.length || 1;
    const map = new Map<string, number>();
    for (const item of items) {
        const raw = (extractor(item) || 'Not Specified').trim();
        const key = raw || 'Not Specified';
        map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
        .map(([label, count]) => ({
            label,
            count,
            pct: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count);
}

// Reusable Lightweight SVG Donut Chart
function DonutChart({
    segments,
    centerValue,
    centerLabel,
}: {
    segments: { label: string; value: number; color: string }[];
    centerValue: string | number;
    centerLabel: string;
}) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                    />
                    {total > 0 &&
                        segments.map((seg) => {
                            if (seg.value === 0) return null;
                            const strokeDasharray = `${(seg.value / total) * circumference} ${circumference}`;
                            const strokeDashoffset = -(cumulative / total) * circumference;
                            cumulative += seg.value;
                            return (
                                <circle
                                    key={seg.label}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth="12"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="butt"
                                />
                            );
                        })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-xl font-black text-slate-950 tabular-nums leading-none">
                        {centerValue}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                        {centerLabel}
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full space-y-2.5 text-xs">
                {segments.map((seg) => {
                    const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
                    return (
                        <div key={seg.label} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className="w-3 h-3 rounded-xs shrink-0"
                                    style={{ backgroundColor: seg.color }}
                                />
                                <span className="font-semibold text-slate-700 truncate">{seg.label}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-950 tabular-nums shrink-0">
                                {seg.value} <span className="text-slate-400 font-normal">({pct}%)</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Reusable Horizontal Bar List
function BarList({
    items,
    barColor = 'bg-blue-900',
    maxItems = 8,
}: {
    items: CountItem[];
    barColor?: string;
    maxItems?: number;
}) {
    const visible = items.slice(0, maxItems);
    const maxVal = visible[0]?.count || 1;

    if (visible.length === 0) {
        return <p className="text-xs text-slate-400 py-4">No data available yet.</p>;
    }

    return (
        <div className="space-y-3">
            {visible.map((item) => (
                <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-800 truncate" title={item.label}>
                            {item.label}
                        </span>
                        <span className="font-mono font-bold text-slate-950 tabular-nums shrink-0">
                            {item.count} <span className="text-slate-400 font-normal">({item.pct}%)</span>
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.max(4, (item.count / maxVal) * 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminAnalyticsPage() {
    const [registrations, setRegistrations] = useState<StudentRegistrationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [excludeRejected, setExcludeRejected] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin-data', { cache: 'no-store' });
            const data = await res.json();
            if (Array.isArray(data.registrations)) {
                setRegistrations(data.registrations);
            }
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const getStatus = (r: StudentRegistrationRecord): PaymentVerificationStatus =>
        r.paymentVerificationStatus || 'Pending Review';

    // Active dataset (optionally excludes rejected registrations for accurate catering/seat counts)
    const activeRecords = useMemo(
        () =>
            excludeRejected
                ? registrations.filter((r) => getStatus(r) !== 'Rejected')
                : registrations,
        [registrations, excludeRejected]
    );

    // Payment Status Counts (always computed on all registrations)
    const verifiedCount = registrations.filter((r) => getStatus(r) === 'Verified').length;
    const pendingCount = registrations.filter((r) => getStatus(r) === 'Pending Review').length;
    const rejectedCount = registrations.filter((r) => getStatus(r) === 'Rejected').length;

    // Field Breakdowns
    const collegeStats = useMemo(
        () => groupAndCount(activeRecords, (r) => r.collegeName),
        [activeRecords]
    );
    const batchStats = useMemo(
        () => groupAndCount(activeRecords, (r) => r.academicBatch),
        [activeRecords]
    );
    const levelStats = useMemo(
        () => groupAndCount(activeRecords, (r) => r.academicLevel),
        [activeRecords]
    );
    const genderStats = useMemo(
        () => groupAndCount(activeRecords, (r) => r.gender),
        [activeRecords]
    );
    const foodStats = useMemo(
        () => groupAndCount(activeRecords, (r) => r.foodPreference),
        [activeRecords]
    );
    const cityStats = useMemo(
        () => groupAndCount(activeRecords, (r) => `${r.city}, ${r.state}`),
        [activeRecords]
    );
    const dateStats = useMemo(() => {
        const map = new Map<string, number>();
        for (const r of activeRecords) {
            const d = r.registrationDate || 'Unknown';
            map.set(d, (map.get(d) || 0) + 1);
        }
        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .reverse();
    }, [activeRecords]);

    const maxDailyCount = Math.max(...dateStats.map((d) => d.count), 1);

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight block leading-none">
                                NUMESCON 2026 · ANALYTICS REPORT
                            </span>
                            <span className="text-xs text-slate-400 mt-1 block">
                                Live Database Breakdown · North Bengal Medical College &amp; Hospital
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={fetchAnalytics}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / PDF</span>
                        </button>

                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Admin</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950">
                            Delegate Registration Analytics
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Generated from {registrations.length} total database records ({activeRecords.length}{' '}
                            included in charts below).
                        </p>
                    </div>

                    <label className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer shadow-2xs print:hidden">
                        <input
                            type="checkbox"
                            checked={excludeRejected}
                            onChange={(e) => setExcludeRejected(e.target.checked)}
                            className="w-4 h-4 rounded-sm text-blue-900"
                        />
                        <span>Exclude Rejected Receipts ({rejectedCount}) from Charts</span>
                    </label>
                </div>

                {/* Row 1: Top KPI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Active Delegates</span>
                            <Users className="w-4 h-4 text-blue-900" />
                        </div>
                        <div className="font-serif text-3xl font-black text-slate-950 tabular-nums">
                            {activeRecords.length}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 tabular-nums">
                            of {TOTAL_SEATS} total seats ({Math.round((activeRecords.length / TOTAL_SEATS) * 100)}%)
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Verified Revenue</span>
                            <IndianRupee className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="font-serif text-3xl font-black text-emerald-800 tabular-nums">
                            ₹{(verifiedCount * WORKSHOP_FEE).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 tabular-nums">
                            + ₹{(pendingCount * WORKSHOP_FEE).toLocaleString('en-IN')} pending audit
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Colleges Represented</span>
                            <Building2 className="w-4 h-4 text-indigo-700" />
                        </div>
                        <div className="font-serif text-3xl font-black text-slate-950 tabular-nums">
                            {collegeStats.length}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 truncate">
                            Top: {collegeStats[0]?.label || '—'}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider">Catering Split</span>
                            <Utensils className="w-4 h-4 text-amber-700" />
                        </div>
                        <div className="font-serif text-2xl font-black text-slate-950 tabular-nums">
                            {foodStats.find((f) => f.label === 'Vegetarian')?.count || 0} Veg ·{' '}
                            {foodStats.find((f) => f.label === 'Non-Vegetarian')?.count || 0} Non-Veg
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Based on active delegates</div>
                    </div>
                </div>

                {/* Row 2: Cluster Capacity Fill Bars */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-serif text-xl font-bold text-slate-950">
                                Cluster Seat Utilization (A &amp; B: 30 · C: 50)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Real-time fill rate across Dopamine Drive, Adrenaline Rush, and Serotonin Surge
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {(['A', 'B', 'C'] as ClusterId[]).map((cid) => {
                            const maxSeats = CLUSTER_CAPACITY[cid];
                            const count = activeRecords.filter((r) => r.clusterId === cid).length;
                            const pct = Math.min(100, Math.round((count / maxSeats) * 100));
                            const isFull = count >= maxSeats;

                            return (
                                <div
                                    key={cid}
                                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold uppercase text-blue-900">
                                            Cluster {cid}
                                        </span>
                                        <span
                                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${isFull
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                        >
                                            {isFull ? 'FULL' : `${maxSeats - count} left`}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="font-serif font-bold text-lg text-slate-950">
                                            {CLUSTERS[cid].name}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                                            <strong className="text-slate-900">{count}</strong> / {maxSeats} seats
                                            filled ({pct}%)
                                        </div>
                                    </div>

                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-rose-600' : pct >= 80 ? 'bg-amber-500' : 'bg-blue-900'
                                                }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Row 3: Donut Charts (Payment Audit, Food Preference, Gender) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">
                                Payment Verification Status
                            </h3>
                        </div>
                        <DonutChart
                            centerValue={registrations.length}
                            centerLabel="Total"
                            segments={[
                                { label: 'Verified', value: verifiedCount, color: '#059669' },
                                { label: 'Pending Review', value: pendingCount, color: '#d97706' },
                                { label: 'Rejected', value: rejectedCount, color: '#e11d48' },
                            ]}
                        />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <Utensils className="w-4 h-4 text-amber-700" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">
                                Dietary / Lunch Preference
                            </h3>
                        </div>
                        <DonutChart
                            centerValue={activeRecords.length}
                            centerLabel="Meals"
                            segments={[
                                {
                                    label: 'Vegetarian',
                                    value: foodStats.find((f) => f.label === 'Vegetarian')?.count || 0,
                                    color: '#16a34a',
                                },
                                {
                                    label: 'Non-Vegetarian',
                                    value: foodStats.find((f) => f.label === 'Non-Vegetarian')?.count || 0,
                                    color: '#ea580c',
                                },
                            ]}
                        />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <Users className="w-4 h-4 text-blue-900" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">Gender Distribution</h3>
                        </div>
                        <DonutChart
                            centerValue={activeRecords.length}
                            centerLabel="Delegates"
                            segments={[
                                {
                                    label: 'Male',
                                    value: genderStats.find((g) => g.label === 'Male')?.count || 0,
                                    color: '#1e3a8a',
                                },
                                {
                                    label: 'Female',
                                    value: genderStats.find((g) => g.label === 'Female')?.count || 0,
                                    color: '#7c3aed',
                                },
                                {
                                    label: 'Prefer not to say',
                                    value: genderStats.find((g) => g.label === 'Prefer not to say')?.count || 0,
                                    color: '#64748b',
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* Row 4: Daily Registration Trend (Vertical Bar Chart) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-4 h-4 text-blue-900" />
                        <h3 className="font-serif text-lg font-bold text-slate-950">
                            Registrations by Date
                        </h3>
                    </div>

                    {dateStats.length === 0 ? (
                        <p className="text-xs text-slate-400">No registration dates recorded yet.</p>
                    ) : (
                        <div className="flex items-end gap-3 h-48 overflow-x-auto pb-2 pt-6">
                            {dateStats.map((d) => (
                                <div
                                    key={d.date}
                                    className="flex flex-col items-center justify-end gap-1.5 min-w-[56px] flex-1 h-full"
                                >
                                    <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                                        {d.count}
                                    </span>
                                    <div
                                        className="w-full max-w-[42px] bg-blue-900 hover:bg-blue-700 rounded-t-xl transition-all"
                                        style={{ height: `${Math.max(8, (d.count / maxDailyCount) * 100)}%` }}
                                        title={`${d.date}: ${d.count} registrations`}
                                    />
                                    <span className="text-[10px] font-semibold text-slate-500 text-center truncate w-full">
                                        {d.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Row 5: Detailed Field Bar Charts (Academic Batch, Level, Colleges, Cities) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <GraduationCap className="w-4 h-4 text-blue-900" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">Academic Batch</h3>
                        </div>
                        <BarList items={batchStats} barColor="bg-blue-900" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <GraduationCap className="w-4 h-4 text-indigo-700" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">
                                Academic Year / Standing
                            </h3>
                        </div>
                        <BarList items={levelStats} barColor="bg-indigo-700" />
                    </div>

                    {/* <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">
                                Top Medical Colleges / Institutions
                            </h3>
                        </div>
                        <BarList items={collegeStats} barColor="bg-emerald-700" maxItems={10} />
                    </div> */}

                    {/* <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="w-4 h-4 text-amber-700" />
                            <h3 className="font-serif text-lg font-bold text-slate-950">
                                City &amp; State Breakdown
                            </h3>
                        </div>
                        <BarList items={cityStats} barColor="bg-amber-600" maxItems={10} />
                    </div> */}
                </div>
            </div>
        </main>
    );
}