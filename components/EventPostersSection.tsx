'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Square,
  FileText,
} from 'lucide-react';
import { EventPosterItem, getPosterPages } from '@/lib/store';

function getPageLabel(index: number, total: number, category: EventPosterItem['category']): string {
  if (index === 0) return 'Page 1 · Main Poster';
  if (index === 1 && category === 'Competitions') return 'Page 2 · Rules & Details';
  if (index === 1 && total === 2) return 'Page 2 · Rules & Details';
  return `Page ${index + 1} · Details`;
}

export default function EventPostersSection() {
  const [posters, setPosters] = useState<EventPosterItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPoster, setSelectedPoster] = useState<EventPosterItem | null>(null);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [readerLayout, setReaderLayout] = useState<'single' | 'spread'>('single');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin-data')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setPosters(Array.isArray(data.posters) ? data.posters : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPosters([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openPosterOverlay = (poster: EventPosterItem) => {
    setSelectedPoster(poster);
    setActivePageIndex(0);
    setReaderLayout('single');
  };

  const closePosterOverlay = useCallback(() => {
    setSelectedPoster(null);
    setActivePageIndex(0);
    setReaderLayout('single');
  }, []);

  const selectedPages = selectedPoster ? getPosterPages(selectedPoster) : [];

  const goNextPage = useCallback(() => {
    if (selectedPages.length <= 1) return;
    setActivePageIndex((prev) => (prev + 1) % selectedPages.length);
  }, [selectedPages.length]);

  const goPrevPage = useCallback(() => {
    if (selectedPages.length <= 1) return;
    setActivePageIndex((prev) => (prev - 1 + selectedPages.length) % selectedPages.length);
  }, [selectedPages.length]);

  useEffect(() => {
    if (!selectedPoster) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePosterOverlay();
      } else if (e.key === 'ArrowRight') {
        goNextPage();
      } else if (e.key === 'ArrowLeft') {
        goPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPoster, closePosterOverlay, goNextPage, goPrevPage]);

  const categories = ['All', 'Competitions', 'Official Release', 'Keynotes', 'Workshops', 'Cultural'];

  const filteredPosters = posters.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const handleShare = (poster: EventPosterItem) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/#posters`);
      setCopiedId(poster.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const safeActiveIndex =
    selectedPages.length > 0 ? Math.min(activePageIndex, selectedPages.length - 1) : 0;

  return (
    <section id="posters" className="py-24 sm:py-32 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-900 mb-3">
              <ImageIcon className="w-4 h-4" />
              <span>Creative Gallery · Event &amp; Competition Releases</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
              Official Event Posters &amp; Competition Rules
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
              Official schedule announcements, keynote releases, workshop tracks, and competition rulebooks published by the NUMESCON 2026 Organizing Committee at North Bengal Medical College &amp; Hospital.
            </p>
          </div>

          <div className="self-start md:self-auto flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>NBMC&amp;H Official Releases</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">28–29 Nov 2026</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 sm:p-20 flex flex-col items-center justify-center min-h-[420px]">
            <div className="w-12 h-12 rounded-2xl border border-slate-300 bg-white flex items-center justify-center text-slate-400 mb-4 animate-pulse">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Checking for official releases...
            </p>
          </div>
        )}

        {/* Gorgeous Animated Empty State when zero posters have been uploaded via Admin */}
        {!isLoading && posters.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden bg-[#070D1D] border border-slate-800/80 px-6 py-16 sm:px-14 sm:py-24 text-center shadow-xl"
          >
            {/* Subtle architectural dot matrix */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-[0.08]" />

            {/* Drifting Ambient Gallery Light Planes */}
            <motion.div
              aria-hidden="true"
              animate={{ x: [-40, 50, -40], y: [-20, 30, -20], opacity: [0.22, 0.38, 0.22] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-24 left-1/4 w-[420px] h-[420px] rounded-full bg-blue-600/30 blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              animate={{ x: [45, -35, 45], y: [25, -25, 25], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -bottom-28 right-1/4 w-[380px] h-[380px] rounded-full bg-amber-500/20 blur-3xl"
            />

            {/* Floating Layered Exhibition Poster Triptych */}
            <div className="relative mx-auto w-full max-w-md h-56 sm:h-64 flex items-center justify-center mb-10">
              {/* Left Gallery Frame */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-9, -6, -9] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-6 sm:left-12 w-28 sm:w-32 aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/95 border border-white/10 shadow-2xl p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-1 rounded-full bg-blue-400/50" />
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-white/10" />
                  <div className="w-3/4 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1/2 h-1.5 rounded-full bg-amber-400/30" />
                </div>
              </motion.div>

              {/* Right Gallery Frame */}
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [9, 6, 9] }}
                transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute right-6 sm:right-12 w-28 sm:w-32 aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/95 border border-white/10 shadow-2xl p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-1 rounded-full bg-amber-400/50" />
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-white/10" />
                  <div className="w-2/3 h-1.5 rounded-full bg-white/10" />
                  <div className="w-4/5 h-1.5 rounded-full bg-blue-400/30" />
                </div>
              </motion.div>

              {/* Center Featured Exhibition Frame */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-36 sm:w-44 aspect-[3/4] rounded-2xl bg-gradient-to-b from-slate-900 via-[#0E1B36] to-slate-950 border border-white/20 shadow-[0_25px_70px_-15px_rgba(37,99,235,0.45)] overflow-hidden p-5 flex flex-col justify-between"
              >
                {/* Sweeping Ambient Sheen */}
                <motion.div
                  aria-hidden="true"
                  animate={{ x: ['-140%', '220%'] }}
                  transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-y-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                />

                <div className="relative flex items-center justify-between text-[10px] font-mono tracking-widest text-amber-300/90">
                  <span>NUMESCON</span>
                  <span className="tabular-nums">2026</span>
                </div>

                <div className="relative my-auto flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-16 h-16 rounded-2xl border border-amber-300/40"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300 shadow-inner">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="relative space-y-1.5 border-t border-white/10 pt-3">
                  <div className="w-4/5 mx-auto h-1.5 rounded-full bg-white/25" />
                  <div className="w-1/2 mx-auto h-1 rounded-full bg-blue-300/40" />
                </div>
              </motion.div>
            </div>

            {/* Editorial Copy */}
            <div className="relative max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-300/90 mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Curatorial Gallery · Awaiting First Release</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Official Event Posters &amp; Releases Coming Soon
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                The NUMESCON 2026 creative gallery is live and ready. As soon as the Organizing Committee publishes official posters, competition rulebooks, keynote flyers, or workshop brochures from the secretariat portal, they will appear right here automatically.
              </p>

              {/* Hairline Institutional Footer Strip */}
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="text-slate-200 font-medium">NUMESCON 2026</span>
                <span aria-hidden="true">·</span>
                <span>North Bengal Medical College &amp; Hospital</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 tabular-nums text-amber-300/90">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>28 &amp; 29 November 2026</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Populated Gallery State (Only Admin-Uploaded Posters) */}
        {!isLoading && posters.length > 0 && (
          <>
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-12 w-fit max-w-full overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {cat === 'All' ? `All Releases (${posters.length})` : cat}
                </button>
              ))}
            </div>

            {filteredPosters.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center">
                <p className="font-serif text-2xl font-bold text-slate-900">
                  No releases published under {activeCategory} yet
                </p>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Switch back to view all official posters currently published by the NUMESCON 2026 committee.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="mt-6 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Show All Releases
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {filteredPosters.map((poster, index) => {
                  const pages = getPosterPages(poster);
                  const coverUrl = pages[0];
                  const hasMultiplePages = pages.length > 1;

                  return (
                    <motion.div
                      key={poster.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(index * 0.06, 0.3),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative group"
                    >
                      {/* Subtle physical stacked-sheet backing for multi-page competition/rule posters */}
                      {hasMultiplePages && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-1.5 inset-x-3 h-6 rounded-b-3xl bg-slate-200/80 border border-slate-300/70 transition-transform duration-300 group-hover:translate-y-0.5"
                        />
                      )}

                      <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between h-full">
                        {/* Poster Visual Frame */}
                        <div
                          onClick={() => openPosterOverlay(poster)}
                          className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-slate-950"
                        >
                          {coverUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={coverUrl}
                              alt={poster.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${poster.themeColor} p-8 flex flex-col justify-between text-white relative`}
                            >
                              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15" />

                              <div className="relative flex items-center justify-between text-xs tracking-widest font-mono">
                                <span className="font-bold text-amber-400 uppercase">
                                  NUMESCON 2026
                                </span>
                                <span className="text-[11px] text-slate-300">
                                  {poster.category}
                                </span>
                              </div>

                              <div className="relative text-center my-auto py-6">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                  <ImageIcon className="w-7 h-7" />
                                </div>

                                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold block mb-2">
                                  NBMC&amp;H Official Release
                                </span>

                                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight text-white mb-3 text-balance">
                                  {poster.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xs mx-auto leading-relaxed">
                                  {poster.tagline}
                                </p>
                              </div>

                              <div className="relative pt-4 border-t border-white/20 flex items-center justify-between text-xs text-slate-300">
                                <div>
                                  <span className="block font-bold text-white">
                                    {poster.dateStr.split('·')[0]}
                                  </span>
                                  <span className="text-[11px] text-slate-400">{poster.venue}</span>
                                </div>

                                {poster.highlightTag && (
                                  <span className="font-semibold text-amber-300 text-xs">
                                    {poster.highlightTag}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Multi-page Sheet Count Corner Indicator */}
                          {hasMultiplePages && (
                            <div className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-xs text-white border border-white/20 text-xs font-bold shadow-md">
                              <Layers className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              <span>{pages.length} Pages · Rules Inside</span>
                            </div>
                          )}

                          {/* Inspect Overlay Prompt */}
                          <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-bold backdrop-blur-2xs px-4 text-center">
                            {hasMultiplePages ? (
                              <>
                                <FileText className="w-5 h-5 text-amber-300 shrink-0" />
                                <span>Open Poster &amp; Rules ({pages.length} Pages)</span>
                              </>
                            ) : (
                              <>
                                <Maximize2 className="w-5 h-5 shrink-0" />
                                <span>Enlarge Poster</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Poster Description & Card Action Footer */}
                        <div className="p-6 sm:p-7 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                              <span className="text-blue-900 font-semibold">{poster.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{poster.dateStr}</span>
                            </div>

                            <h4 className="font-serif text-xl font-bold text-slate-950 leading-snug line-clamp-1">
                              {poster.title}
                            </h4>

                            <p className="text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                              {poster.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-slate-500 truncate">
                              {poster.venue}
                            </span>

                            <button
                              onClick={() => openPosterOverlay(poster)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline px-3 py-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                            >
                              <span>
                                {hasMultiplePages
                                  ? `View All ${pages.length} Pages →`
                                  : 'View Release →'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Modal: Fullscreen Multi-Page Poster & Competition Rules Reader */}
        {selectedPoster && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs"
            onClick={closePosterOverlay}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Sticky Dark Reader Header */}
              <div className="px-5 sm:px-7 py-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    NUMESCON 2026 · {selectedPoster.category}
                  </span>
                  {selectedPages.length > 1 && (
                    <>
                      <span className="text-slate-600" aria-hidden="true">
                        |
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                        <Layers className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          {readerLayout === 'spread'
                            ? `Viewing All ${selectedPages.length} Pages`
                            : `${getPageLabel(safeActiveIndex, selectedPages.length, selectedPoster.category)} (${safeActiveIndex + 1} / ${selectedPages.length})`}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Single Page vs All Pages Spread Toggle */}
                  {selectedPages.length > 1 && (
                    <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setReaderLayout('single')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          readerLayout === 'single'
                            ? 'bg-white text-slate-950'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        title="Focus one page at a time"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Single Page</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setReaderLayout('spread')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          readerLayout === 'spread'
                            ? 'bg-white text-slate-950'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        title="Read all pages side by side"
                      >
                        <Columns2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">All {selectedPages.length} Pages</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={closePosterOverlay}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Reader Visual Stage */}
              <div className="bg-slate-900/95 px-4 py-6 sm:px-8 sm:py-8 border-b border-slate-200">
                {selectedPages.length > 0 ? (
                  readerLayout === 'spread' && selectedPages.length > 1 ? (
                    /* Side-by-Side / Stacked All-Pages Spread View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedPages.map((pageUrl, idx) => (
                        <div
                          key={`${selectedPoster.id}-spread-${idx}`}
                          className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col"
                        >
                          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-amber-300">
                              {getPageLabel(idx, selectedPages.length, selectedPoster.category)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActivePageIndex(idx);
                                setReaderLayout('single');
                              }}
                              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold cursor-pointer"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Focus</span>
                            </button>
                          </div>
                          <div className="p-3 flex items-center justify-center bg-slate-950 flex-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pageUrl}
                              alt={`${selectedPoster.title} — Page ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              onClick={() => {
                                setActivePageIndex(idx);
                                setReaderLayout('single');
                              }}
                              className="max-h-[62vh] w-full object-contain rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Single Page Focused Carousel View */
                    <div className="space-y-5">
                      <div className="relative flex items-center justify-center">
                        {/* Previous Page Arrow */}
                        {selectedPages.length > 1 && (
                          <button
                            type="button"
                            onClick={goPrevPage}
                            aria-label="Previous poster page"
                            className="absolute left-0 sm:left-2 z-10 w-11 h-11 rounded-2xl bg-slate-950/85 hover:bg-white hover:text-slate-950 text-white border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                        )}

                        <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl flex items-center justify-center min-h-[320px] sm:min-h-[460px]">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={selectedPages[safeActiveIndex]}
                              src={selectedPages[safeActiveIndex]}
                              alt={`${selectedPoster.title} — Page ${safeActiveIndex + 1}`}
                              referrerPolicy="no-referrer"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                              className="max-h-[66vh] w-auto max-w-full object-contain"
                            />
                          </AnimatePresence>
                        </div>

                        {/* Next Page Arrow */}
                        {selectedPages.length > 1 && (
                          <button
                            type="button"
                            onClick={goNextPage}
                            aria-label="Next poster page"
                            className="absolute right-0 sm:right-2 z-10 w-11 h-11 rounded-2xl bg-slate-950/85 hover:bg-white hover:text-slate-950 text-white border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        )}
                      </div>

                      {/* Multi-Page Switcher Bar + Thumbnail Strip */}
                      {selectedPages.length > 1 && (
                        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                          {/* Page Thumbnails */}
                          <div className="flex items-center gap-2.5 overflow-x-auto max-w-full py-1">
                            {selectedPages.map((pageUrl, idx) => {
                              const isCurrent = idx === safeActiveIndex;
                              return (
                                <button
                                  key={`${selectedPoster.id}-thumb-${idx}`}
                                  type="button"
                                  onClick={() => setActivePageIndex(idx)}
                                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                                    isCurrent
                                      ? 'bg-white text-slate-950 border-amber-400 shadow-md'
                                      : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-slate-500'
                                  }`}
                                >
                                  <div className="w-9 h-11 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700/40">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={pageUrl}
                                      alt={`Page ${idx + 1} thumbnail`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-left">
                                    <span className="block text-[11px] font-mono font-bold uppercase leading-tight">
                                      Page {idx + 1}
                                    </span>
                                    <span
                                      className={`block text-[10px] leading-tight mt-0.5 ${
                                        isCurrent ? 'text-slate-600 font-semibold' : 'text-slate-400'
                                      }`}
                                    >
                                      {idx === 0 ? 'Main Cover' : 'Rules / Details'}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Quick Flip CTA */}
                          <button
                            type="button"
                            onClick={goNextPage}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer shrink-0"
                          >
                            <span>
                              {safeActiveIndex === 0
                                ? `Read Page 2 (Rules & Details)`
                                : safeActiveIndex < selectedPages.length - 1
                                  ? `Next Page (${safeActiveIndex + 2}/${selectedPages.length})`
                                  : 'Back to Page 1 (Main Poster)'}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div
                    className={`w-full max-w-md mx-auto aspect-[3/4] rounded-2xl bg-gradient-to-br ${selectedPoster.themeColor} p-8 flex flex-col justify-between text-white text-center`}
                  >
                    <div className="flex items-center justify-between text-xs tracking-widest font-mono">
                      <span className="font-bold text-amber-400">NUMESCON 2026</span>
                      <span className="text-slate-300">{selectedPoster.category}</span>
                    </div>

                    <div className="my-auto py-6">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 mb-4 shadow-sm">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight text-white mb-3">
                        {selectedPoster.title}
                      </h3>
                      <p className="text-sm text-slate-300 max-w-xs mx-auto">
                        {selectedPoster.tagline}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/20 text-xs text-slate-300 flex items-center justify-between">
                      <span>{selectedPoster.dateStr}</span>
                      <span>{selectedPoster.venue}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Release Details & Actions */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950">
                      {selectedPoster.title}
                    </h3>
                    {selectedPoster.tagline && (
                      <p className="text-sm font-medium text-blue-900 mt-1">
                        {selectedPoster.tagline}
                      </p>
                    )}
                  </div>

                  {selectedPages.length > 1 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{selectedPages.length}-Page Competition / Event Release</span>
                    </span>
                  )}
                </div>

                <p className="text-base text-slate-600 mb-6 leading-relaxed">
                  {selectedPoster.description}
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6">
                  <div>
                    <span className="text-slate-500 font-medium block">Schedule:</span>
                    <strong className="text-slate-900 block">{selectedPoster.dateStr}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Venue:</span>
                    <strong className="text-slate-900 block">{selectedPoster.venue}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <span className="text-xs text-slate-500">
                    {selectedPages.length > 1
                      ? 'Tip: Use Left / Right arrow keys or switch to "All Pages" to read poster & rules together.'
                      : 'Official NBMC&H NUMESCON 2026 release.'}
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleShare(selectedPoster)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    >
                      {copiedId === selectedPoster.id ? 'Copied Link!' : 'Share Release'}
                    </button>
                    <button
                      onClick={closePosterOverlay}
                      className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
