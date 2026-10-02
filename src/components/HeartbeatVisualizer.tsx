import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';

export default function HeartbeatVisualizer() {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const playHeartbeatPulse = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Lub sound (low pitch, gentle)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Dub sound (slightly higher, short pause)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(70, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.24);
      gain2.gain.setValueAtTime(0.09, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.24);
    } catch {
      // AudioContext may be restricted by browser policy
    }
  };

  const toggleSound = () => {
    if (isPlayingSound) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsPlayingSound(false);
    } else {
      playHeartbeatPulse();
      const interval = window.setInterval(() => {
        playHeartbeatPulse();
      }, 1000); // 60 BPM resting heart rate
      timerRef.current = interval;
      setIsPlayingSound(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs text-[#2D6A5F]/80">
      <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#EBF3F0] border border-[#D5E5E0]">
        <Activity className="w-3.5 h-3.5 text-[#2D6A5F] animate-pulse" />
        <span className="font-medium text-[#1E4E45]">Resting Rhythm</span>
        <span className="text-[#5B887E]">· 60 BPM</span>
      </div>

      <button
        onClick={toggleSound}
        type="button"
        className="flex items-center gap-1.5 py-1 px-2 rounded-full border border-transparent hover:border-[#D5E5E0] hover:bg-[#EBF3F0] transition-colors text-[#3D6B62]"
        title={isPlayingSound ? 'Mute cardiac rhythm' : 'Listen to resting rhythm'}
        aria-label="Toggle soothing cardiac heartbeat sound"
      >
        {isPlayingSound ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#2D6A5F]" />
            <span className="text-[11px] font-medium text-[#2D6A5F]">Audio On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#6D8A83]" />
            <span className="text-[11px] text-[#6D8A83]">Ambient Audio</span>
          </>
        )}
      </button>
    </div>
  );
}
