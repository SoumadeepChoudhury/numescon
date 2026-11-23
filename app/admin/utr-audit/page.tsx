'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Save,
    Eye,
    X,
} from 'lucide-react';

interface UtrAuditRecord {
    delegateId: string;
    fullName: string;
    email: string;
    phone: string;
    academicBatch: string;
    admissionYear: string;
    clusterId: string;
    receiptUrl: string;
    utrNumber: string;
    isFlagged: boolean;
    flaggedReason: string;
}

export default function UtrAuditPage() {
    const [records, setRecords] = useState<UtrAuditRecord[]>([]);
    const [draftUtrs, setDraftUtrs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'UNIQUE' | 'FLAGGED'>('ALL');
    const [search, setSearch] = useState('');
    const [previewReceipt, setPreviewReceipt] = useState<UtrAuditRecord | null>(null);
    const [banner, setBanner] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const loadRecords = async () => {
        try {
            const res = await fetch('/api/utr-audit', { cache: 'no-store' });
            const data = await res.json();
            if (Array.isArray(data.records)) {
                setRecords(data.records);
                const initialDrafts: Record<string, string> = {};
                for (const r of data.records as UtrAuditRecord[]) {
                    initialDrafts[r.delegateId] = r.utrNumber || '';
                }
                setDraftUtrs(initialDrafts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handleSaveUtr = async (delegateId: string) => {
        const utr = (draftUtrs[delegateId] || '').trim();
        if (!utr) return;

        setSavingId(delegateId);
        setBanner(null);
        try {
            const res = await fetch('/api/utr-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delegateId, utrNumber: utr }),
            });
            const data = await res.json();
            if (!res.ok) {
                setBanner({ type: 'error', text: data.error || 'Failed to save UTR.' });
            } else if (data.isDuplicate) {
                setBanner({
                    type: 'error',
                    text: `DUPLICATE UTR DETECTED! ${delegateId} and ${(data.conflictingDelegateIds || []).join(', ')} have both been flagged.`,
                });
            } else {
                setBanner({
                    type: 'success',
                    text: `Saved unique UTR for ${delegateId}.`,
                });
            }
            await loadRecords();
        } catch {
            setBanner({ type: 'error', text: 'Network error while saving UTR.' });
        } finally {
            setSavingId(null);
        }
    };

    const flaggedCount = records.filter((r) => r.isFlagged).length;
    const uniqueCount = records.filter((r) => r.utrNumber && !r.isFlagged).length;
    const pendingCount = records.filter((r) => !r.utrNumber).length;

    const filtered = records.filter((r) => {
        if (filter === 'FLAGGED' && !r.isFlagged) return false;
        if (filter === 'UNIQUE' && (!r.utrNumber || r.isFlagged)) return false;
        if (filter === 'PENDING' && r.utrNumber) return false;
        const q = search.toLowerCase();
        if (!q) return true;
        return (
            r.fullName.toLowerCase().includes(q) ||
            r.delegateId.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.utrNumber.toLowerCase().includes(q)
        );
    });

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                    <div>
                        <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight block">
                            NUMESCON 2026 · UTR AUDIT &amp; DUPLICATE CHECKER
                        </span>
                        <span className="text-xs text-slate-400">
                            Separate UTR Verification Table · Auto-flags colliding delegates
                        </span>
                    </div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Admin Console</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {banner && (
                    <div
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-bold ${banner.type === 'error'
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {banner.type === 'error' ? (
                                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                            ) : (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                            <span>{banner.text}</span>
                        </div>
                        <button onClick={() => setBanner(null)} className="p-1 cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Filter & Search Controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        {(
                            [
                                ['ALL', `All (${records.length})`],
                                ['PENDING', `Pending UTR (${pendingCount})`],
                                ['UNIQUE', `Unique (${uniqueCount})`],
                                ['FLAGGED', `Flagged Duplicates (${flaggedCount})`],
                            ] as const
                        ).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${filter === key
                                    ? key === 'FLAGGED'
                                        ? 'bg-rose-700 text-white'
                                        : 'bg-slate-950 text-white'
                                    : key === 'FLAGGED' && flaggedCount > 0
                                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search delegate, email, UTR..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950 text-white text-xs uppercase tracking-wider">
                                    <th className="py-4 px-5">Delegate</th>
                                    <th className="py-4 px-5">Receipt</th>
                                    <th className="py-4 px-5">Enter / Update UTR Number</th>
                                    <th className="py-4 px-5">Audit Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            Loading delegates...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            No delegates match this filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((rec) => (
                                        <tr
                                            key={rec.delegateId}
                                            className={rec.isFlagged ? 'bg-rose-50/70' : 'hover:bg-slate-50/70'}
                                        >
                                            <td className="py-4 px-5 align-top">
                                                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                                    {rec.delegateId}
                                                </span>
                                                <div className="font-bold text-slate-950 mt-1">{rec.fullName}</div>
                                                <div className="text-xs text-slate-500">{rec.phone}</div>
                                                {(rec.academicBatch || rec.admissionYear) && (
                                                    <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                                                        {rec.academicBatch}
                                                        {rec.admissionYear ? ` (Adm. ${rec.admissionYear})` : ''}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-4 px-5 align-top">
                                                {rec.receiptUrl ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewReceipt(rec)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold cursor-pointer"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>View Receipt</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No screenshot</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-5 align-top">
                                                <div className="flex items-center gap-2 max-w-sm">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter 12-digit UTR..."
                                                        value={draftUtrs[rec.delegateId] ?? ''}
                                                        onChange={(e) =>
                                                            setDraftUtrs((prev) => ({
                                                                ...prev,
                                                                [rec.delegateId]: e.target.value,
                                                            }))
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveUtr(rec.delegateId);
                                                        }}
                                                        className={`flex-1 px-3 py-2 text-xs font-mono bg-white border rounded-xl ${rec.isFlagged ? 'border-rose-400' : 'border-slate-300'
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={savingId === rec.delegateId}
                                                        onClick={() => handleSaveUtr(rec.delegateId)}
                                                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                                                    >
                                                        <Save className="w-3.5 h-3.5" />
                                                        <span>{savingId === rec.delegateId ? '...' : 'Save'}</span>
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-4 px-5 align-top text-xs">
                                                {rec.isFlagged ? (
                                                    <div className="inline-flex flex-col gap-1">
                                                        <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                                            <span>FLAGGED DUPLICATE</span>
                                                        </span>
                                                        <span className="text-[11px] text-rose-700/90">
                                                            {rec.flaggedReason}
                                                        </span>
                                                    </div>
                                                ) : rec.utrNumber ? (
                                                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                        <span>Unique UTR Saved</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                                                        <Clock className="w-4 h-4 shrink-0" />
                                                        <span>Pending Entry</span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Receipt Preview Modal */}
            {previewReceipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs"
                    onClick={() => setPreviewReceipt(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
                            <div className="text-xs font-bold">
                                <span className="text-amber-400 font-mono block">{previewReceipt.delegateId}</span>
                                <span>{previewReceipt.fullName}</span>
                            </div>
                            <button
                                onClick={() => setPreviewReceipt(null)}
                                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-900 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewReceipt.receiptUrl}
                                alt={previewReceipt.fullName}
                                referrerPolicy="no-referrer"
                                className="max-h-[75vh] w-auto object-contain rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}