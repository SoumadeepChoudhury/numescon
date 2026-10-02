import React, { useState } from 'react';

interface NbmcLogoProps {
  className?: string;
  size?: number;
}

export default function NbmcLogo({ className = '', size = 100 }: NbmcLogoProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = ['/nbmc-logo.png', '/nbmc-logo.svg'];

  const handleError = () => {
    setSrcIndex((prev) => prev + 1);
  };

  if (srcIndex < sources.length) {
    return (
      <img
        src={sources[srcIndex]}
        alt="North Bengal Medical College Emblem"
        width={size}
        height={size}
        onError={handleError}
        className={`object-contain rounded-full select-none ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // Pure SVG inline fallback directly matching the official NBMC circular seal
  return (
    <div
      className={`inline-block select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title="North Bengal Medical College"
    >
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="160" cy="160" r="154" fill="#FFFFFF" />
        <circle cx="160" cy="160" r="150" stroke="#A81D24" strokeWidth="8" fill="none" />
        <circle cx="160" cy="160" r="114" stroke="#A81D24" strokeWidth="4" fill="none" />
        <defs>
          <path id="textPathUpper" d="M 38 160 A 122 122 0 1 1 282 160" fill="none" />
          <path id="textPathLower" d="M 276 160 A 122 122 0 0 1 44 160" fill="none" />
          <path id="mottoPath" d="M -60 -42 Q 0 -58 60 -42" fill="none" />
        </defs>
        <text fill="#A81D24" fontSize="19.5" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2.2">
          <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
            NORTH BENGAL MEDICAL COLLEGE
          </textPath>
        </text>
        <text fill="#A81D24" fontSize="21" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          <textPath href="#textPathLower" startOffset="50%" textAnchor="middle">
            ESTD. : 1968
          </textPath>
        </text>
        <g transform="translate(160, 160)">
          <path d="M -75 -44 C -45 -66 45 -66 75 -44 C 70 -36 65 -36 55 -40 C 30 -50 -30 -50 -55 -40 C -65 -36 -70 -36 -75 -44 Z" fill="#FFFFFF" stroke="#A81D24" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M -75 -44 L -82 -32 C -85 -24 -76 -20 -70 -26 L -66 -35" fill="#FFFFFF" stroke="#A81D24" strokeWidth="3" />
          <path d="M 75 -44 L 82 -32 C 85 -24 76 -20 70 -26 L 66 -35" fill="#FFFFFF" stroke="#A81D24" strokeWidth="3" />
          <text fill="#A81D24" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
            <textPath href="#mottoPath" startOffset="50%" textAnchor="middle">
              SERVITIUM DO POPULUM
            </textPath>
          </text>
          <g fill="#A81D24">
            <path d="M 0 -7 C -9 -14 -12 -28 0 -36 C 12 -28 9 -14 0 -7 Z" />
            <circle cx="-5" cy="-28" r="4.5" />
            <circle cx="5" cy="-28" r="4.5" />
            <path d="M 0 7 C -9 14 -12 28 0 36 C 12 28 9 14 0 7 Z" />
            <circle cx="-5" cy="28" r="4.5" />
            <circle cx="5" cy="28" r="4.5" />
            <path d="M -7 0 C -14 -9 -28 -12 -36 0 C -28 12 -14 9 -7 0 Z" />
            <circle cx="-28" cy="-5" r="4.5" />
            <circle cx="-28" cy="5" r="4.5" />
            <path d="M 7 0 C 14 -9 28 -12 36 0 C 28 12 14 9 7 0 Z" />
            <circle cx="28" cy="-5" r="4.5" />
            <circle cx="28" cy="5" r="4.5" />
            <circle cx="0" cy="0" r="4.5" />
            <path d="M -42 16 C -58 10 -64 30 -52 42 C -42 50 -32 40 -38 28 Z" />
            <circle cx="-47" cy="26" r="3" fill="#FFFFFF" />
            <path d="M 42 16 C 58 10 64 30 52 42 C 42 50 32 40 38 28 Z" />
            <circle cx="47" cy="26" r="3" fill="#FFFFFF" />
            <path d="M -22 42 L 22 42 L 18 64 C 10 66 -10 66 -18 64 Z" />
            <circle cx="-10" cy="52" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="52" r="2.5" fill="#FFFFFF" />
            <circle cx="10" cy="52" r="2.5" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}
