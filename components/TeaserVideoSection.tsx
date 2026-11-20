'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Film, Clapperboard, Sparkles, Calendar } from 'lucide-react';

export default function TeaserVideoSection() {
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoTitle, setCustomVideoTitle] = useState<string>(
    'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar'
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin-data', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setCustomVideoUrl(data.teaserVideoUrl ? String(data.teaserVideoUrl) : null);
          if (data.teaserVideoTitle) {
            setCustomVideoTitle(String(data.teaserVideoTitle));
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCustomVideoUrl(null);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isYoutubeEmbed =
    customVideoUrl &&
    (customVideoUrl.includes('youtube.com') || customVideoUrl.includes('youtu.be'));

  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) return url;
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
    return url;
  };

  const rhythmBars = [0.35, 0.72, 0.5, 0.95, 0.6, 0.84, 0.42];

  return (
    <section id="teaser" className="py-24 sm:py-32 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-800 mb-3">
              <Film className="w-4 h-4 text-rose-700" />
              <span>Official Teaser Premiere · Nov 28 &amp; 29, 2026</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 tracking-tight text-balance">
              Experience the Energy of NUMESCON 2026
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed text-balance">
              Get an exclusive look inside the NBMC&amp;H Auditorium scientific sessions, campus activities, and parallel practical workshop tracks at North Bengal Medical College &amp; Hospital.
            </p>
          </div>

          <div className="self-start md:self-auto flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>NBMC&amp;H Auditorium</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">28 &amp; 29 Nov 2026</span>
          </div>
        </div>

        {/* Loading Shimmer */}
        {isLoading && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video max-h-[640px] flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-400 animate-pulse mb-4">
              <Film className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-400">
              Loading official trailer reel...
            </span>
          </div>
        )}

        {/* Uploaded Trailer Player (Only shown when an admin uploads/publishes a real video) */}
        {!isLoading && customVideoUrl && (
          <>
            <div className="relative rounded-3xl overflow-hidden border border-slate-950/10 bg-slate-950 shadow-xl">
              <div className="relative aspect-video w-full max-h-[680px] bg-slate-950">
                {isYoutubeEmbed ? (
                  <iframe
                    src={getYoutubeEmbedUrl(customVideoUrl)}
                    title={customVideoTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={customVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-slate-950"
                  />
                )}
              </div>
            </div>

            {/* Video Metadata Caption Strip */}
            <div className="mt-6 py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-900 font-semibold">{customVideoTitle}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-500">
                <span>North Bengal Medical College &amp; Hospital</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">28 &amp; 29 Nov 2026</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-800 font-semibold">Official Release</span>
              </div>
            </div>
          </>
        )}

        {/* Gorgeous Cinematic Animated Empty State when no trailer has been uploaded */}
        {!isLoading && !customVideoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#050A17] shadow-2xl min-h-[460px] md:aspect-video max-h-[660px] flex flex-col justify-between p-6 sm:p-10 lg:p-14"
          >
            {/* Subtle Architectural Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

            {/* Twin Drifting Cinematic Spotlight Beams */}
            <motion.div
              aria-hidden="true"
              animate={{ x: [-80, 90, -80], y: [-30, 40, -30], opacity: [0.22, 0.38, 0.22] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-blue-600/30 blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              animate={{ x: [70, -70, 70], y: [30, -35, 30], opacity: [0.16, 0.3, 0.16] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -bottom-32 right-1/4 w-[440px] h-[440px] rounded-full bg-rose-600/20 blur-3xl"
            />

            {/* Top Cinema Framing Strip */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Clapperboard className="w-4 h-4 text-amber-300" />
                <span className="font-medium tracking-wider uppercase text-slate-200">
                  Premiere Stage
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400 tabular-nums">
                <span>NBMC&amp;H AUDITORIUM</span>
                <span aria-hidden="true">·</span>
                <span>HD STREAMING READY</span>
              </div>
            </div>

            {/* Center Kinetic Aperture & Editorial Announcement */}
            <div className="relative z-10 my-auto py-8 sm:py-10 flex flex-col items-center text-center">
              {/* Concentric Rotating Cinema Rings + Symmetric Rhythm Bars */}
              <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
                {/* Left Symmetrical Rhythm Bars */}
                <div className="hidden sm:flex items-center gap-1.5 h-12" aria-hidden="true">
                  {rhythmBars.map((scale, i) => (
                    <motion.div
                      key={`left-${i}`}
                      animate={{ scaleY: [0.25, scale, 0.3, scale * 0.75, 0.25] }}
                      transition={{
                        duration: 2.6 + i * 0.18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.12,
                      }}
                      className="w-1 h-10 rounded-full bg-gradient-to-t from-blue-500/40 via-sky-300/70 to-amber-300/60 origin-center"
                    />
                  ))}
                </div>

                {/* Central Kinetic Aperture */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  {/* Outer Dashed Architectural Ring */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-white/20"
                  />

                  {/* Middle Counter-Rotating Accent Ring */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-3 rounded-full border border-blue-400/30 border-t-amber-300/80"
                  />

                  {/* Soft Breathing Halo */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.3, 0.65, 0.3] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-6 rounded-full bg-blue-500/20 blur-md"
                  />

                  {/* Center Glass Emblem */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-amber-300 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                    <Film className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                </div>

                {/* Right Symmetrical Rhythm Bars */}
                <div className="hidden sm:flex items-center gap-1.5 h-12" aria-hidden="true">
                  {[...rhythmBars].reverse().map((scale, i) => (
                    <motion.div
                      key={`right-${i}`}
                      animate={{ scaleY: [0.25, scale, 0.3, scale * 0.75, 0.25] }}
                      transition={{
                        duration: 2.6 + i * 0.18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.12 + 0.2,
                      }}
                      className="w-1 h-10 rounded-full bg-gradient-to-t from-blue-500/40 via-sky-300/70 to-amber-300/60 origin-center"
                    />
                  ))}
                </div>
              </div>

              <span className="text-xs font-medium tracking-widest uppercase text-amber-300/90 mb-3">
                NUMESCON 2026 · Official Teaser Reel
              </span>

              <h3 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight text-balance max-w-2xl">
                Official Fest Trailer Premiering Soon
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Our premiere film stage is ready. Once the NUMESCON 2026 Organizing Committee uploads the official teaser video from the secretariat console, it will stream directly here in high definition.
              </p>
            </div>

            {/* Bottom Cinema Framing Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <span className="text-slate-200 font-medium">
                  North Bengal Medical College &amp; Hospital
                </span>
                <span className="hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="hidden sm:inline">Sushrutanagar, Darjeeling</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-amber-300/90 tabular-nums">
                <Calendar className="w-3.5 h-3.5" />
                <span>28 &amp; 29 November 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
