import React from 'react';

export default function MedicalBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. TOP-LEFT: Anatomical Heart & Aorta */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-6 -left-6 sm:top-4 sm:left-6 w-52 h-52 sm:w-72 sm:h-72 text-[#2D6A5F] opacity-[0.07] transition-opacity duration-1000"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Superior Vena Cava & Aorta */}
        <path d="M90 30 C90 15, 110 15, 115 30 L115 50" />
        <path d="M100 25 C100 8, 130 8, 135 25 L135 48" />
        <path d="M110 20 C110 4, 145 4, 148 22 L148 50" />
        {/* Aortic Arch */}
        <path d="M85 50 C85 20, 150 20, 150 55 C150 70, 135 80, 120 85" />
        {/* Pulmonary Artery Trunk */}
        <path d="M75 55 C65 45, 50 60, 65 72 C75 80, 95 80, 105 88" />
        <path d="M60 52 L48 42 M55 58 L42 55" />
        {/* Right Atrium & Ventricle */}
        <path d="M68 75 C45 85, 42 120, 58 140 C75 160, 95 180, 118 190" />
        {/* Left Ventricle & Apex */}
        <path d="M118 190 C135 178, 160 145, 155 110 C152 85, 135 75, 120 85" />
        {/* Coronary sulcus and blood vessels */}
        <path d="M112 88 Q100 120, 118 190" strokeDasharray="3 3" />
        <path d="M106 110 Q85 125, 75 135" />
        <path d="M110 135 Q130 145, 140 155" />
        <path d="M104 150 Q92 162, 88 170" />
      </svg>

      {/* 2. TOP-RIGHT: Lungs & Bronchial Tree */}
      <svg
        viewBox="0 0 220 200"
        className="absolute -top-8 -right-8 sm:top-2 sm:right-6 w-56 h-56 sm:w-80 sm:h-80 text-[#2D6A5F] opacity-[0.075]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Trachea */}
        <path d="M110 15 L110 55" strokeWidth="2.5" />
        <path d="M103 25 L117 25 M103 33 L117 33 M103 41 L117 41 M103 49 L117 49" />
        {/* Carina / Primary Bronchi */}
        <path d="M110 55 Q95 70, 75 80" strokeWidth="2" />
        <path d="M110 55 Q125 70, 145 80" strokeWidth="2" />
        {/* Right Bronchial Branches */}
        <path d="M75 80 Q60 85, 45 100" />
        <path d="M75 80 Q70 100, 60 125" />
        <path d="M45 100 Q35 110, 30 130" />
        <path d="M45 100 Q50 115, 45 135" />
        <path d="M60 125 Q55 145, 65 160" />
        {/* Left Bronchial Branches */}
        <path d="M145 80 Q160 85, 175 100" />
        <path d="M145 80 Q150 100, 160 125" />
        <path d="M175 100 Q185 110, 190 130" />
        <path d="M175 100 Q170 115, 175 135" />
        <path d="M160 125 Q165 145, 155 160" />
        {/* Right Lung Outline */}
        <path d="M105 60 C80 50, 40 65, 30 110 C20 150, 40 180, 85 178 C98 178, 102 160, 104 120 Z" />
        {/* Left Lung Outline (with cardiac notch) */}
        <path d="M115 60 C140 50, 180 65, 190 110 C200 150, 180 180, 135 178 C120 178, 122 155, 126 135 C128 120, 118 100, 116 80 Z" />
      </svg>

      {/* 3. BOTTOM-LEFT: Classic Clinical Stethoscope */}
      <svg
        viewBox="0 0 240 240"
        className="absolute -bottom-10 -left-6 sm:bottom-4 sm:left-8 w-56 h-56 sm:w-76 sm:h-76 text-[#2D6A5F] opacity-[0.08]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Binaural Earpieces */}
        <circle cx="65" cy="30" r="4" fill="currentColor" />
        <circle cx="115" cy="30" r="4" fill="currentColor" />
        {/* Metal Ear Tubes */}
        <path d="M65 34 C65 60, 80 85, 90 92" />
        <path d="M115 34 C115 60, 100 85, 90 92" />
        <path d="M75 58 Q90 64, 105 58" />
        {/* Acoustic Tube Loop */}
        <path d="M90 92 C90 120, 105 140, 130 145 C165 152, 185 125, 175 95 C165 65, 130 75, 125 110 C120 145, 140 180, 170 190" strokeWidth="2.2" />
        {/* Stem and Chestpiece / Diaphragm */}
        <path d="M170 190 L185 195" strokeWidth="3" />
        <rect x="185" y="188" width="12" height="18" rx="2" strokeWidth="1.5" />
        <circle cx="204" cy="197" r="14" strokeWidth="2" />
        <circle cx="204" cy="197" r="8" fill="currentColor" fillOpacity="0.2" />
      </svg>

      {/* 4. BOTTOM-RIGHT: DNA Double Helix & Synthesis */}
      <svg
        viewBox="0 0 220 220"
        className="absolute -bottom-10 -right-6 sm:bottom-4 sm:right-10 w-52 h-52 sm:w-72 sm:h-72 text-[#2D6A5F] opacity-[0.08]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* DNA Helix Strand 1 */}
        <path d="M40 20 Q70 60, 100 100 T160 180 T190 210" strokeWidth="2" />
        {/* DNA Helix Strand 2 */}
        <path d="M160 20 Q130 60, 100 100 T40 180 T20 210" strokeWidth="2" />
        {/* Base Pairs / Rungs */}
        <line x1="55" y1="40" x2="145" y2="40" />
        <circle cx="100" cy="40" r="2.5" fill="currentColor" />
        <line x1="72" y1="65" x2="128" y2="65" />
        <circle cx="100" cy="65" r="2.5" fill="currentColor" />
        <line x1="92" y1="90" x2="108" y2="90" />
        <line x1="90" y1="110" x2="110" y2="110" />
        <line x1="72" y1="135" x2="128" y2="135" />
        <circle cx="100" cy="135" r="2.5" fill="currentColor" />
        <line x1="55" y1="160" x2="145" y2="160" />
        <circle cx="100" cy="160" r="2.5" fill="currentColor" />
        <line x1="45" y1="185" x2="165" y2="185" />
        <circle cx="100" cy="185" r="2.5" fill="currentColor" />
      </svg>

      {/* 5. CENTER-LEFT: Rod of Asclepius & Caduceus Staff */}
      <svg
        viewBox="0 0 100 220"
        className="hidden md:block absolute top-1/2 -translate-y-1/2 left-10 lg:left-20 w-24 h-56 text-[#2D6A5F] opacity-[0.06]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Central Wooden Staff */}
        <line x1="50" y1="15" x2="50" y2="205" strokeWidth="2.5" />
        <circle cx="50" cy="15" r="6" fill="currentColor" fillOpacity="0.3" />
        {/* Entwined Serpent */}
        <path d="M50 200 C35 185, 35 165, 50 150 C65 135, 65 115, 50 100 C35 85, 35 65, 50 50 C62 38, 65 25, 52 22 C45 20, 42 26, 44 32" strokeWidth="2" />
        {/* Serpent Eye & Tongue */}
        <circle cx="48" cy="24" r="1.5" fill="currentColor" />
      </svg>

      {/* 6. CENTER-RIGHT: Clinical Microscope */}
      <svg
        viewBox="0 0 160 200"
        className="hidden md:block absolute top-1/2 -translate-y-1/2 right-10 lg:right-20 w-32 h-44 text-[#2D6A5F] opacity-[0.06]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Base */}
        <rect x="30" y="175" width="100" height="15" rx="3" strokeWidth="2" />
        {/* Curved Arm */}
        <path d="M50 175 C50 120, 70 80, 110 75 L110 95" strokeWidth="3" />
        {/* Eyepiece / Body Tube */}
        <line x1="125" y1="30" x2="95" y2="85" strokeWidth="4" />
        <rect x="120" y="20" width="14" height="14" rx="2" transform="rotate(30 120 20)" />
        {/* Revolving Nosepiece & Objectives */}
        <circle cx="95" cy="85" r="7" />
        <line x1="95" y1="92" x2="90" y2="108" strokeWidth="3" />
        <line x1="98" y1="91" x2="105" y2="105" strokeWidth="2" />
        {/* Stage and Clips */}
        <rect x="65" y="118" width="55" height="6" rx="1" strokeWidth="2" />
        {/* Condenser and mirror */}
        <circle cx="92" cy="138" r="8" />
        <circle cx="92" cy="160" r="10" strokeDasharray="3 2" />
      </svg>

      {/* 7. Subdued Continuous Medical Cardiogram Rhythm Band Across Width */}
      <div className="absolute bottom-14 left-0 right-0 h-10 opacity-[0.06] overflow-hidden flex">
        <svg viewBox="0 0 1200 40" className="w-full h-full text-[#2D6A5F] stroke-current fill-none stroke-[1.5]" preserveAspectRatio="none">
          <path d="M0 20 L200 20 L210 12 L220 28 L230 4 L240 36 L250 16 L260 20 L500 20 L510 12 L520 28 L530 4 L540 36 L550 16 L560 20 L800 20 L810 12 L820 28 L830 4 L840 36 L850 16 L860 20 L1100 20 L1110 12 L1120 28 L1130 4 L1140 36 L1150 16 L1160 20 L1200 20" />
        </svg>
      </div>
    </div>
  );
}
