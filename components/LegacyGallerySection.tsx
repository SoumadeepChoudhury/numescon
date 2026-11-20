'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  History,
  Maximize2,
  X,
  Quote,
  Camera,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ArchivePhotoItem } from '@/lib/store';

export default function LegacyGallerySection() {
  const [archivePhotos, setArchivePhotos] = useState<ArchivePhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ArchivePhotoItem | null>(null);
  const [activeYear, setActiveYear] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin-data')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setArchivePhotos(Array.isArray(data.archivePhotos) ? data.archivePhotos : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setArchivePhotos([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const availableYears = Array.from(
    new Set(archivePhotos.map((p) => p.year).filter(Boolean))
  ).sort((a, b) => b.localeCompare(a));

  const filteredPhotos = archivePhotos.filter((p) => {
    if (activeYear === 'All') return true;
    return p.year === activeYear;
  });

  return (
    <section id="archive" className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-900 mb-3">
              <History className="w-4 h-4" />
              <span>Archive Footprint · Past Editions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
              Archival Moments from Previous NUMESCON
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
              Highlights and milestones from previous editions hosted across participating medical college complexes.
            </p>
          </div>

          <div className="self-start md:self-auto flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>NBMC&amp;H Official Archive</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {archivePhotos.length > 0
                ? `${archivePhotos.length} Verified Records`
                : 'Curating Archive'}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 sm:p-20 flex flex-col items-center justify-center min-h-[380px] mb-16">
            <div className="w-12 h-12 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Loading archival records...
            </p>
          </div>
        )}

        {/* Gorgeous Animated Empty State when zero archival photos have been uploaded via Admin */}
        {!isLoading && archivePhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden bg-[#090F1E] border border-slate-800 px-6 py-16 sm:px-14 sm:py-24 text-center shadow-xl mb-16"
          >
            {/* Architectural hairline grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#94a3b8_0.75px,transparent_0.75px)] [background-size:26px_26px] opacity-[0.07]" />

            {/* Drifting Warm Archival & Deep Indigo Ambient Glows */}
            <motion.div
              aria-hidden="true"
              animate={{ x: [-45, 55, -45], y: [-18, 28, -18], opacity: [0.18, 0.34, 0.18] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-24 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/20 blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              animate={{ x: [50, -45, 50], y: [22, -26, 22], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -bottom-28 right-1/4 w-[420px] h-[420px] rounded-full bg-blue-600/25 blur-3xl"
            />

            {/* Floating Archival Polaroid / Gallery Contact Sheet Stack */}
            <div className="relative mx-auto w-full max-w-lg h-52 sm:h-60 flex items-center justify-center mb-10">
              {/* Left Tilted Archival Print */}
              <motion.div
                animate={{ y: [0, -9, 0], rotate: [-11, -8, -11] }}
                transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 sm:left-10 w-32 sm:w-36 aspect-[4/3] rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl p-3 flex flex-col justify-between"
              >
                <div className="w-full h-14 sm:h-16 rounded-lg bg-gradient-to-br from-slate-800 to-blue-950/60 border border-white/5" />
                <div className="flex items-center justify-between pt-2">
                  <span className="w-12 h-1.5 rounded-full bg-white/15" />
                  <span className="text-[9px] font-mono text-amber-300/70">2024</span>
                </div>
              </motion.div>

              {/* Right Tilted Archival Print */}
              <motion.div
                animate={{ y: [0, -11, 0], rotate: [11, 8, 11] }}
                transition={{ duration: 8.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute right-4 sm:right-10 w-32 sm:w-36 aspect-[4/3] rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl p-3 flex flex-col justify-between"
              >
                <div className="w-full h-14 sm:h-16 rounded-lg bg-gradient-to-br from-slate-800 to-amber-950/50 border border-white/5" />
                <div className="flex items-center justify-between pt-2">
                  <span className="w-10 h-1.5 rounded-full bg-white/15" />
                  <span className="text-[9px] font-mono text-sky-300/70">2025</span>
                </div>
              </motion.div>

              {/* Center Prominent Archival Contact Frame */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-44 sm:w-52 aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-900 via-[#101C36] to-slate-950 border border-white/20 shadow-[0_24px_65px_-15px_rgba(245,158,11,0.28)] overflow-hidden p-4 flex flex-col justify-between"
              >
                {/* Sweeping Light Sheen */}
                <motion.div
                  aria-hidden="true"
                  animate={{ x: ['-140%', '230%'] }}
                  transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-y-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                />

                <div className="relative flex items-center justify-between text-[10px] font-mono tracking-widest text-amber-300/90">
                  <span>ARCHIVE</span>
                  <span>NBMC&amp;H</span>
                </div>

                <div className="relative my-auto flex items-center justify-center">
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-16 h-16 rounded-full border border-dashed border-amber-300/35"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>

                <div className="relative flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] font-mono text-slate-400">
                  <span>PAST EDITIONS</span>
                  <span className="text-sky-300/90">CURATING</span>
                </div>
              </motion.div>
            </div>

            {/* Editorial Announcement Copy */}
            <div className="relative max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-300/90 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NUMESCON Heritage Gallery · Awaiting Archival Uploads</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Archival Photographs Coming Soon
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                Verified photographs and moments from previous NUMESCON editions published by the Organizing Committee will appear right here automatically.
              </p>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="text-slate-200 font-medium">NUMESCON Archive</span>
                <span aria-hidden="true">·</span>
                <span>North Bengal Medical College &amp; Hospital</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-amber-300/90">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Previous Editions Collection</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Populated Archive Gallery (Only Admin-Uploaded Photos) */}
        {!isLoading && archivePhotos.length > 0 && (
          <>
            {/* Dynamic Year Filter Controls */}
            <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl mb-10 w-fit max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveYear('All')}
                className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${activeYear === 'All'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
                  }`}
              >
                All Archive Photos ({archivePhotos.length})
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${activeYear === year
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                    }`}
                >
                  NUMESCON {year}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.05, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm font-bold backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4" />
                        <span>View Photo</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-blue-900 tabular-nums">
                          NUMESCON {photo.year}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{photo.category}</span>
                        {photo.highlightStat && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-slate-700">{photo.highlightStat}</span>
                          </>
                        )}
                      </div>

                      <h4 className="font-serif text-xl font-bold text-slate-950 leading-snug mb-2 group-hover:text-blue-900 transition-colors">
                        {photo.title}
                      </h4>

                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Verified Archival Photo</span>
                    <span className="text-blue-900 font-bold group-hover:underline">
                      Inspect Record →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
