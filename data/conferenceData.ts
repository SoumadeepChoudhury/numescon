export type ClusterId = 'A' | 'B' | 'C';

export interface Workshop {
  id: string;
  clusterId: ClusterId;
  day: 1 | 2;
  title: string;
  subtitle: string;
  leadFaculty: string;
  facultyDesignation: string;
  facultyAffiliation: string;
  hall: string;
  timeSlot: string;
  duration: string;
  prerequisites: string;
  learningOutcomes: string[];
}

export interface ClusterInfo {
  id: ClusterId;
  name: string;
  title: string;
  tagline: string;
  focusArea: string;
  themeColor: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  idealFor: string;
  workshops: Workshop[];
}

export interface ScheduleEvent {
  id: string;
  day: number;
  dateStr: string;
  startTime: string;
  endTime: string;
  slotBadge?: string;
  title: string;
  category: 'Keynote' | 'Workshop' | 'Symposium' | 'Competition' | 'Cultural' | 'Ceremony';
  venue: string;
  speaker?: string;
  speakerRole?: string;
  description: string;
  highlights?: string[];
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  tier: 'Organiser' | 'Joint Organiser' | 'Executive Members' | 'Food Committee';
  department: string;
  institution: string;
  avatarSeed: string;
  message?: string;
}

export interface LegacyPhoto {
  id: string;
  year: '2024' | '2025';
  title: string;
  category: 'Orations' | 'Clinical Labs' | 'Hackathon' | 'Valedictory';
  caption: string;
  highlightStat?: string;
}

export const CLUSTERS: Record<ClusterId, ClusterInfo> = {
  A: {
    id: 'A',
    name: 'Dopamine Drive',
    title: 'Cluster A: Dopamine Drive',
    tagline: 'Acute Resuscitation, Bedside Imaging & Functional Diagnostics',
    focusArea: 'BLS, Fracture Management, POCUS, Safe Injection & Transfusion, OAE & Stroboscopy, PFT',
    themeColor: 'text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    borderColor: 'border-rose-200 hover:border-rose-300',
    description:
      'Dopamine Drive pairs high-velocity emergency stabilization on Day 1 (BLS, Fracture Management, and Point-of-Care Ultrasound) with essential clinical safety and diagnostic mastery on Day 2 (Safe Injection & Transfusion Procedures, OAE Test & Stroboscopy, and Pulmonary Function Testing).',
    idealFor:
      'Undergraduates and interns seeking a versatile command across emergency stabilization, orthopedics, bedside imaging, ENT diagnostics, and respiratory physiology.',
    workshops: [
      // Day 1 (28 November 2026)
      {
        id: 'ws-a1',
        clusterId: 'A',
        day: 1,
        title: 'Basic Life Support (BLS)',
        subtitle: 'High-quality chest compressions, AED deployment, and emergency airway rescue drills',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Emergency & Critical Care',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Workshop Hall A · NBMC&H',
        timeSlot: '28 Nov 2026 · 4:00 – 5:00 PM',
        duration: '1 Hour (Hands-on Station)',
        prerequisites: 'Open to all undergraduate batches and interns.',
        learningOutcomes: [
          'Execute high-fraction chest compressions with proper depth, rate, and full recoil',
          'Operate an Automated External Defibrillator (AED) seamlessly during cardiac arrest',
          'Coordinate single and two-rescuer CPR and foreign-body airway obstruction relief',
        ],
      },
      {
        id: 'ws-a2',
        clusterId: 'A',
        day: 1,
        title: 'Fracture Management',
        subtitle: 'Immobilization principles, POP slab application, splinting, and neurovascular checks',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Orthopedics',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Orthopedics Skill Bay · NBMC&H',
        timeSlot: '28 Nov 2026 · 5:00 – 6:00 PM',
        duration: '1 Hour (Hands-on Casting)',
        prerequisites: 'All splinting and plaster materials provided at the workbench.',
        learningOutcomes: [
          'Perform rapid primary assessment of open vs closed extremity fractures',
          'Apply functional POP slabs and splints with safe three-point moulding',
          'Monitor distal neurovascular status and prevent acute compartment syndrome',
        ],
      },
      {
        id: 'ws-a3',
        clusterId: 'A',
        day: 1,
        title: 'POCUS (Point-of-Care Ultrasound)',
        subtitle: 'Bedside acoustic windows, e-FAST free fluid triage, and lung sliding evaluation',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Radiodiagnosis & Medicine',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Imaging Simulation Bay · NBMC&H',
        timeSlot: '28 Nov 2026 · 6:00 – 7:00 PM',
        duration: '1 Hour (Live Probe Practice)',
        prerequisites: 'Basic abdominal and thoracic surface anatomy helpful.',
        learningOutcomes: [
          'Optimize curvilinear and linear probe orientation, depth, and gain settings',
          'Acquire Morison pouch, splenorenal, pericardial, and pelvic e-FAST views',
          'Identify pleural sliding and B-lines for rapid bedside respiratory triage',
        ],
      },
      // Day 2 (29 November 2026)
      {
        id: 'ws-a4',
        clusterId: 'A',
        day: 2,
        title: 'Safe Injection Practices & Transfusion Procedures',
        subtitle: 'Aseptic parenteral delivery, blood component verification, and transfusion reaction protocols',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Transfusion Medicine & Nursing Skills',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Clinical Procedures Lab · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 01',
        duration: 'Hands-on Clinical Module',
        prerequisites: 'Open to all registered Dopamine Drive delegates.',
        learningOutcomes: [
          'Apply WHO safe injection guidelines, sharps disposal, and needle-stick injury prophylaxis',
          'Verify blood grouping, cross-matching tags, and safe bedside transfusion initiation',
          'Recognize and manage acute hemolytic, febrile, and allergic transfusion reactions',
        ],
      },
      {
        id: 'ws-a5',
        clusterId: 'A',
        day: 2,
        title: 'OAE Test & Stroboscopy',
        subtitle: 'Otoacoustic emissions (OAE) hearing screening and laryngeal videostroboscopy assessment',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of ENT (Otorhinolaryngology)',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'ENT Diagnostic Suite · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 02',
        duration: 'Hands-on Diagnostic Module',
        prerequisites: 'Open to all registered Dopamine Drive delegates.',
        learningOutcomes: [
          'Conduct neonatal and clinical Otoacoustic Emissions (OAE) cochlear screening tests',
          'Interpret vocal fold mucosal wave symmetry and glottic closure on videostroboscopy',
          'Correlate objective ENT diagnostic traces with common hearing and voice disorders',
        ],
      },
      {
        id: 'ws-a6',
        clusterId: 'A',
        day: 2,
        title: 'Pulmonary Function Test (PFT)',
        subtitle: 'Spirometry execution, flow-volume loop analysis, and obstructive vs restrictive patterns',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Pulmonary Medicine & Physiology',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Respiratory Diagnostics Lab · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 03',
        duration: 'Hands-on Spirometry Module',
        prerequisites: 'Open to all registered Dopamine Drive delegates.',
        learningOutcomes: [
          'Coach patients to achieve repeatable, ATS-acceptable forced expiratory spirometry maneuvers',
          'Differentiate obstructive, restrictive, and mixed ventilatory defects using FEV1/FVC ratios',
          'Evaluate bronchodilator reversibility and upper airway obstruction flow-volume loops',
        ],
      },
    ],
  },
  B: {
    id: 'B',
    name: 'Atropine Alert',
    title: 'Cluster B: Atropine Alert',
    tagline: 'Critical Airway, Trauma Resuscitation & Cross-Sectional Imaging',
    focusArea: 'Neonatal Resuscitation, BLS, Tracheostomy, Advanced Trauma Care, OT Table Dynamics, CT & MRI',
    themeColor: 'text-blue-700',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    borderColor: 'border-blue-200 hover:border-blue-300',
    description:
      'Atropine Alert is engineered for high-acuity clinicians. Master Neonatal Resuscitation, BLS, and Tracheostomy on Day 1, followed by Advanced Trauma Care, OT Table Dynamics & Anaesthetic Precision, and CT Scan & MRI interpretation on Day 2.',
    idealFor:
      'Students drawn to Emergency Medicine, Anaesthesiology, Critical Care, Trauma Surgery, Neonatology, and Radiology.',
    workshops: [
      // Day 1 (28 November 2026)
      {
        id: 'ws-b1',
        clusterId: 'B',
        day: 1,
        title: 'Neonatal Resuscitation',
        subtitle: 'Golden-minute newborn stabilization, positive pressure ventilation, and NRP steps',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Pediatrics & Neonatology',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Neonatal Simulation Suite · NBMC&H',
        timeSlot: '28 Nov 2026 · 4:00 – 5:00 PM',
        duration: '1 Hour (Manikin Station)',
        prerequisites: 'Open to all undergraduate batches and interns.',
        learningOutcomes: [
          'Perform initial newborn thermoregulation, airway clearing, and breathing assessment',
          'Deliver effective Positive Pressure Ventilation (PPV) and apply MR. SOPA corrective steps',
          'Coordinate neonatal chest compressions and emergency resuscitation team communication',
        ],
      },
      {
        id: 'ws-b2',
        clusterId: 'B',
        day: 1,
        title: 'Basic Life Support (BLS)',
        subtitle: 'Rapid arrest recognition, high-quality CPR cycles, and safe AED rhythm delivery',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Anaesthesiology & Critical Care',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Workshop Hall B · NBMC&H',
        timeSlot: '28 Nov 2026 · 5:00 – 6:00 PM',
        duration: '1 Hour (Hands-on Station)',
        prerequisites: 'Open to all undergraduate batches and interns.',
        learningOutcomes: [
          'Execute AHA-aligned compression-to-ventilation ratios with minimal interruptions',
          'Apply AED pads accurately and follow voice-prompted shock safety protocols',
          'Manage airway rescue breathing with bag-valve-mask seal techniques',
        ],
      },
      {
        id: 'ws-b3',
        clusterId: 'B',
        day: 1,
        title: 'Tracheostomy',
        subtitle: 'Anterior neck surgical landmarks, airway opening, tube insertion, and stoma care',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of ENT & Surgery',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Surgical Airway Lab · NBMC&H',
        timeSlot: '28 Nov 2026 · 6:00 – 7:00 PM',
        duration: '1 Hour (Airway Model Station)',
        prerequisites: 'Basic anterior neck anatomy recommended.',
        learningOutcomes: [
          'Identify thyroid cartilage, cricoid cartilage, and tracheal rings by surface palpation',
          'Practice surgical tracheostomy incision, tracheal window creation, and tube placement',
          'Handle cuff inflation, suctioning, and emergency accidental decannulation troubleshooting',
        ],
      },
      // Day 2 (29 November 2026)
      {
        id: 'ws-b4',
        clusterId: 'B',
        day: 2,
        title: 'Advanced Trauma Care',
        subtitle: 'ATLS primary survey (ABCDE), hemorrhage control, and polytrauma triage stabilization',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Trauma & Emergency Surgery',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Trauma Resuscitation Bay · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 01',
        duration: 'Hands-on Trauma Module',
        prerequisites: 'Open to all registered Atropine Alert delegates.',
        learningOutcomes: [
          'Execute systematic ABCDE trauma primary surveys with cervical spine immobilization',
          'Recognize tension pneumothorax, massive hemothorax, and hemorrhagic shock early',
          'Apply tourniquets, pelvic binders, and rapid fluid/blood resuscitation priorities',
        ],
      },
      {
        id: 'ws-b5',
        clusterId: 'B',
        day: 2,
        title: 'OT Table Dynamics & Anaesthetic Precision',
        subtitle: 'Operating theatre positioning, anaesthesia workstation checks, and intraoperative monitoring',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Anaesthesiology',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'OT Simulation Pavilion · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 02',
        duration: 'Hands-on OT Module',
        prerequisites: 'Open to all registered Atropine Alert delegates.',
        learningOutcomes: [
          'Perform pre-anaesthetic machine checks, breathing circuit verification, and capnography reading',
          'Configure safe patient OT table positions while preventing nerve and pressure injuries',
          'Coordinate surgical-anaesthetic team communication during induction and emergence',
        ],
      },
      {
        id: 'ws-b6',
        clusterId: 'B',
        day: 2,
        title: 'CT Scan & MRI',
        subtitle: 'Systematic neuroradiology, chest/abdominal CT windowing, and essential MRI sequence reading',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Radiodiagnosis',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Radiology Reading Hall · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 03',
        duration: 'Interactive Imaging Module',
        prerequisites: 'Open to all registered Atropine Alert delegates.',
        learningOutcomes: [
          'Differentiate acute intracranial bleeds (EDH, SDH, SAH) and ischemic stroke on NCCT brain',
          'Distinguish T1, T2, FLAIR, and DWI MRI sequences in common neurological emergencies',
          'Read chest and abdominal CT windows for pneumothorax, pulmonary embolism, and bowel pathology',
        ],
      },
    ],
  },
  C: {
    id: 'C',
    name: 'Linezolid Line',
    title: 'Cluster C: Linezolid Line',
    tagline: 'Operative Craft, Bedside Cardiology, Obstetrics & Tissue Diagnostics',
    focusArea: 'Suturing & Surgical Skills, ECG Made Easy, Active Management of Labor, BLS, Pediatric Life Support, Biopsy/FNAC',
    themeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-200 hover:border-emerald-300',
    description:
      'Linezolid Line unites hands-on procedural dexterity with core clinical essentials. Experience Suturing & Surgical Skills, ECG Made Easy, and Active Management of Labor on Day 1, followed by BLS, Pediatric Life Support, and Biopsy / FNAC on Day 2.',
    idealFor:
      'Undergraduates and interns aiming to sharpen surgical suturing, ECG reading, obstetric delivery management, pediatric emergencies, and diagnostic pathology skills.',
    workshops: [
      // Day 1 (28 November 2026)
      {
        id: 'ws-c1',
        clusterId: 'C',
        day: 1,
        title: 'Suturing & Surgical Skills',
        subtitle: 'Instrument handling, interrupted & mattress closures, and secure surgical knot tying',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of General Surgery',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Surgical Skills Bench · NBMC&H',
        timeSlot: '28 Nov 2026 · 4:00 – 5:00 PM',
        duration: '1 Hour (Workbench Practice)',
        prerequisites: 'All suture pads, needle holders, and sutures provided.',
        learningOutcomes: [
          'Hold needle drivers and toothed forceps ergonomically for atraumatic tissue handling',
          'Perform simple interrupted, vertical mattress, and continuous subcuticular wound closures',
          'Tie reliable instrument-assisted and hand-tied surgical square knots cleanly',
        ],
      },
      {
        id: 'ws-c2',
        clusterId: 'C',
        day: 1,
        title: 'ECG Made Easy',
        subtitle: 'Stepwise 12-lead ECG reading, rhythm recognition, STEMI localization, and heart blocks',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of General Medicine',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Workshop Hall C · NBMC&H',
        timeSlot: '28 Nov 2026 · 5:00 – 6:00 PM',
        duration: '1 Hour (Interactive Traces)',
        prerequisites: 'Open to all undergraduate batches.',
        learningOutcomes: [
          'Follow a repeatable 6-step method to evaluate rate, rhythm, axis, intervals, and ST-T segments',
          'Identify acute myocardial infarction territories and lethal tachyarrhythmias rapidly',
          'Distinguish first, second (Mobitz I/II), and third-degree AV conduction blocks',
        ],
      },
      {
        id: 'ws-c3',
        clusterId: 'C',
        day: 1,
        title: 'Active Management of Labor',
        subtitle: 'Partograph monitoring, AMTSL third-stage protocol, and postpartum hemorrhage prevention',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Obstetrics & Gynaecology',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'OB-GYN Skills Suite · NBMC&H',
        timeSlot: '28 Nov 2026 · 6:00 – 7:00 PM',
        duration: '1 Hour (Obstetric Simulation)',
        prerequisites: 'Open to all undergraduate batches and interns.',
        learningOutcomes: [
          'Assess cervical dilation, descent, and uterine contractions systematically on a partogram',
          'Execute Active Management of the Third Stage of Labor (uterotonics, controlled cord traction)',
          'Initiate immediate uterine massage and first-line stabilization for postpartum hemorrhage',
        ],
      },
      // Day 2 (29 November 2026)
      {
        id: 'ws-c4',
        clusterId: 'C',
        day: 2,
        title: 'Basic Life Support (BLS)',
        subtitle: 'Hands-on CPR quality coaching, AED rhythm delivery, and emergency team choreography',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Emergency & Critical Care',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Resuscitation Lab · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 01',
        duration: 'Hands-on Resuscitation Module',
        prerequisites: 'Open to all registered Linezolid Line delegates.',
        learningOutcomes: [
          'Deliver effective adult chest compressions and rescue breaths with zero unnecessary pauses',
          'Integrate rapid AED shock delivery safely in hospital and out-of-hospital scenarios',
          'Execute effective closed-loop communication during emergency resuscitation drills',
        ],
      },
      {
        id: 'ws-c5',
        clusterId: 'C',
        day: 2,
        title: 'Pediatric Life Support',
        subtitle: 'Pediatric assessment triangle, shock & respiratory distress recognition, and infant CPR',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Pediatrics',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Pediatric Skills Bay · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 02',
        duration: 'Hands-on Pediatric Module',
        prerequisites: 'Open to all registered Linezolid Line delegates.',
        learningOutcomes: [
          'Rapidly categorize sick infants and children using the Pediatric Assessment Triangle (PAT)',
          'Perform age-appropriate infant two-thumb encircling CPR and pediatric airway positioning',
          'Calculate weight-based emergency resuscitation fluids and pediatric drug dosages accurately',
        ],
      },
      {
        id: 'ws-c6',
        clusterId: 'C',
        day: 2,
        title: 'Biopsy / FNAC',
        subtitle: 'Fine needle aspiration cytology smear preparation, punch biopsy, and specimen fixation',
        leadFaculty: 'Dr. Faculty Coordinator (TBA)',
        facultyDesignation: 'Workshop Faculty · Department of Pathology & Surgery',
        facultyAffiliation: 'North Bengal Medical College & Hospital (NBMC&H)',
        hall: 'Pathology Skills Lab · NBMC&H',
        timeSlot: '29 Nov 2026 · Session 03',
        duration: 'Hands-on Pathology Module',
        prerequisites: 'Open to all registered Linezolid Line delegates.',
        learningOutcomes: [
          'Perform Fine Needle Aspiration Cytology (FNAC) technique and prepare diagnostic glass smears',
          'Execute punch and incisional tissue biopsy sampling with proper orientation and margins',
          'Ensure immediate wet/air-dry cytology fixation and 10% formalin histopathology preservation',
        ],
      },
    ],
  },
};

export const SCHEDULE_DAYS: { day: number; label: string; dateStr: string; subtitle: string }[] = [
  {
    day: 1,
    label: 'Day 1 · 28 November 2026',
    dateStr: 'Saturday, 28 November 2026',
    subtitle: 'Opening Ceremony, Scientific Slots 01–06 (incl. Dr. Deepak Marwah), Campus Activities & Cluster Workshops (4–7 PM)',
  },
  {
    day: 2,
    label: 'Day 2 · 29 November 2026',
    dateStr: 'Sunday, 29 November 2026',
    subtitle: 'Day 2 Cluster Practical Workshops (3 Modules per Cluster) & Closing Sessions',
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // DAY 1: 28 NOVEMBER 2026
  {
    id: 'ev-101',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    slotBadge: 'INAUGURATION',
    title: 'OPENING CEREMONY & INAUGURATION',
    category: 'Ceremony',
    venue: 'NBMC&H Auditorium',
    speaker: 'Dignitaries, Principal, MSVP & Student Delegation',
    speakerRole: 'North Bengal Medical College & Hospital',
    description:
      'Grand opening ceremony and formal inauguration of NUMESCON 2026 (in collaboration with PLASMA 2026) at NBMC&H Auditorium, featuring welcome addresses, cultural performance, and role play.',
    highlights: ['Performance', 'Role play'],
  },
  {
    id: 'ev-102',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '11:00 AM',
    endTime: '11:20 AM',
    slotBadge: 'SLOT 01',
    title: 'Scientific Session — Slot 01',
    category: 'Keynote',
    venue: 'NBMC&H Auditorium',
    speaker: 'Dr. Debasis Chakraborty',
    speakerRole: 'Distinguished Faculty Speaker',
    description:
      'Opening scientific lecture of NUMESCON 2026 delivered by Dr. Debasis Chakraborty in the NBMC&H Auditorium.',
  },
  {
    id: 'ev-103',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '11:30 AM',
    endTime: '11:50 AM',
    slotBadge: 'SLOT 02',
    title: 'Surgical Academic Session — Slot 02',
    category: 'Keynote',
    venue: 'NBMC&H Auditorium',
    speaker: 'Dr. Kaushik Bhattacharya',
    speakerRole: 'Surgeon',
    description:
      'High-yield surgical perspectives, operative clinical pearls, and modern surgical practice insights by Dr. Kaushik Bhattacharya (Surgeon).',
  },
  {
    id: 'ev-104',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '12:00 PM',
    endTime: '12:20 PM',
    slotBadge: 'SLOT 03',
    title: 'ENT Video-Based Session — Slot 03',
    category: 'Symposium',
    venue: 'NBMC&H Auditorium',
    speaker: 'Department of ENT · NBMC&H',
    speakerRole: 'Video-Endoscopic Clinical Demonstration',
    description:
      'Interactive video-based clinical demonstration covering otorhinolaryngology (ENT) diagnostics, endoscopic anatomy, and surgical procedures.',
  },
  {
    id: 'ev-105',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '12:30 PM',
    endTime: '1:00 PM',
    slotBadge: 'CAMPUS ACTIVITIES',
    title: 'CAMPUS ACTIVITIES',
    category: 'Cultural',
    venue: 'NBMC&H Auditorium & Campus Concourse',
    description:
      'Vibrant midday campus showcase bringing together medical artistry, research poster exhibitions, and student performances.',
    highlights: ['Anatomical face painting', 'Poster display', 'Ramp walk'],
  },
  {
    id: 'ev-106',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '1:00 PM',
    endTime: '1:20 PM',
    slotBadge: 'SLOT 04',
    title: 'Scientific Session — Slot 04',
    category: 'Keynote',
    venue: 'NBMC&H Auditorium',
    speaker: 'Partha Sarathi Bhattacharya',
    speakerRole: 'Featured Academic Speaker',
    description:
      'Midday plenary academic address delivered by Partha Sarathi Bhattacharya at the NBMC&H Auditorium.',
  },
  {
    id: 'ev-107',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '1:30 PM',
    endTime: '1:50 PM',
    slotBadge: 'SLOT 05',
    title: 'Scientific Session — Slot 05',
    category: 'Symposium',
    venue: 'NBMC&H Auditorium',
    speaker: 'Speaker / topic to be confirmed',
    speakerRole: 'Special Academic Slot',
    description:
      'Dedicated scientific slot at NBMC&H Auditorium. Final speaker and specialized topic announcement will be updated shortly.',
  },
  {
    id: 'ev-108',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    slotBadge: 'GUEST LECTURE · SLOT 06',
    title: 'Keynote Guest Lecture — Dr. Deepak Marwah',
    category: 'Keynote',
    venue: 'NBMC&H Auditorium',
    speaker: 'Dr. Deepak Marwah',
    speakerRole: 'Academician | Clinician | Medical Educator (MBBS – MAMC, New Delhi)',
    description:
      'Flagship 60-minute Guest Lecture presented under the aegis of NUMESCON in collaboration with PLASMA 2026. An exceptional opportunity to explore concept-based, clinically integrated Internal Medicine with one of India’s most acclaimed medical educators.',
    highlights: ['Internal Medicine Insights', 'Concept-Based Teaching', 'Live Q&A'],
  },
  {
    id: 'ev-109',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '3:00 PM',
    endTime: '3:45 PM',
    slotBadge: 'LUNCH BREAK',
    title: 'LUNCH BREAK',
    category: 'Ceremony',
    venue: 'NBMC&H Dining Hall & Hospitality Arena',
    description:
      'Scheduled lunch break and inter-college networking for all registered student delegates, speakers, and faculty chairs.',
  },
  {
    id: 'ev-110',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '4:00 PM',
    endTime: '7:00 PM',
    slotBadge: 'CLUSTER A · DOPAMINE DRIVE',
    title: 'Day 1 Practical Workshops — Dopamine Drive',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Hourly Hands-On Stations (4–5 PM, 5–6 PM, 6–7 PM)',
    description:
      'Parallel afternoon workshop schedule for Cluster A (Dopamine Drive) delegates across three sequential 1-hour hands-on stations.',
    highlights: ['4–5 PM: BLS', '5–6 PM: Fracture Management', '6–7 PM: POCUS'],
  },
  {
    id: 'ev-111',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '4:00 PM',
    endTime: '7:00 PM',
    slotBadge: 'CLUSTER B · ATROPINE ALERT',
    title: 'Day 1 Practical Workshops — Atropine Alert',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Hourly Hands-On Stations (4–5 PM, 5–6 PM, 6–7 PM)',
    description:
      'Parallel afternoon workshop schedule for Cluster B (Atropine Alert) delegates covering neonatal resuscitation, life support, and surgical airway skills.',
    highlights: ['4–5 PM: Neonatal Resuscitation', '5–6 PM: BLS', '6–7 PM: Tracheostomy'],
  },
  {
    id: 'ev-112',
    day: 1,
    dateStr: '28 November 2026',
    startTime: '4:00 PM',
    endTime: '7:00 PM',
    slotBadge: 'CLUSTER C · LINEZOLID LINE',
    title: 'Day 1 Practical Workshops — Linezolid Line',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Hourly Hands-On Stations (4–5 PM, 5–6 PM, 6–7 PM)',
    description:
      'Parallel afternoon workshop schedule for Cluster C (Linezolid Line) delegates covering operative suturing, 12-lead ECG interpretation, and active labor management.',
    highlights: [
      '4–5 PM: Suturing & Surgical Skills',
      '5–6 PM: ECG Made Easy',
      '6–7 PM: Active Management of Labor',
    ],
  },

  // DAY 2: 29 NOVEMBER 2026 (Workshops confirmed, general auditorium slots to be finalized)
  {
    id: 'ev-201',
    day: 2,
    dateStr: '29 November 2026',
    startTime: 'Day 2',
    endTime: '3 Sessions',
    slotBadge: 'CLUSTER A · DOPAMINE DRIVE',
    title: 'Day 2 Practical Workshops — Dopamine Drive',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Confirmed Day 2 Modules',
    description:
      'Day 2 hands-on procedural and diagnostic rotations for Cluster A (Dopamine Drive) delegates. Exact hourly slot timings will be finalized shortly.',
    highlights: [
      'Safe Injection Practices & Transfusion Procedures',
      'OAE Test & Stroboscopy',
      'Pulmonary Function Test',
    ],
  },
  {
    id: 'ev-202',
    day: 2,
    dateStr: '29 November 2026',
    startTime: 'Day 2',
    endTime: '3 Sessions',
    slotBadge: 'CLUSTER B · ATROPINE ALERT',
    title: 'Day 2 Practical Workshops — Atropine Alert',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Confirmed Day 2 Modules',
    description:
      'Day 2 trauma, operating theatre, and cross-sectional radiology modules for Cluster B (Atropine Alert) delegates.',
    highlights: [
      'Advanced Trauma Care',
      'OT Table Dynamics & Anaesthetic Precision',
      'CT Scan & MRI',
    ],
  },
  {
    id: 'ev-203',
    day: 2,
    dateStr: '29 November 2026',
    startTime: 'Day 2',
    endTime: '3 Sessions',
    slotBadge: 'CLUSTER C · LINEZOLID LINE',
    title: 'Day 2 Practical Workshops — Linezolid Line',
    category: 'Workshop',
    venue: 'NBMC&H Practical Workshop Halls',
    speaker: 'NBMC&H Workshop Faculty (TBA)',
    speakerRole: '3 Confirmed Day 2 Modules',
    description:
      'Day 2 life support and diagnostic tissue sampling modules for Cluster C (Linezolid Line) delegates.',
    highlights: ['BLS', 'Pediatric Life Support', 'Biopsy / FNAC'],
  },
];

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  // Organiser (NUMESCON 2026)
  {
    id: 'num-org-1',
    name: 'Debojit Das',
    role: 'Organiser',
    tier: 'Organiser',
    department: 'NUMESCON 2026 Core Organizing Desk',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'debojit_das',
  },

  // Joint Organisers (NUMESCON 2026)
  {
    id: 'num-jorg-1',
    name: 'Souhardya Chakraborty',
    role: 'Joint Organiser',
    tier: 'Joint Organiser',
    department: 'NUMESCON 2026 Core Organizing Desk',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'souhardya_chakraborty',
  },
  {
    id: 'num-jorg-2',
    name: 'Biplab Mondal',
    role: 'Joint Organiser',
    tier: 'Joint Organiser',
    department: 'NUMESCON 2026 Core Organizing Desk',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'biplab_mondal',
  },

  // Executive Members (NUMESCON 2026)
  {
    id: 'num-exec-1',
    name: 'Trinankur Mahato',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'trinankur_mahato',
  },
  {
    id: 'num-exec-2',
    name: 'Manali Ghosh',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'manali_ghosh',
  },
  {
    id: 'num-exec-3',
    name: 'Arunava Bakshi',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'arunava_bakshi',
  },
  {
    id: 'num-exec-4',
    name: 'Deeya Sudhrania',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'deeya_sudhrania',
  },
  {
    id: 'num-exec-5',
    name: 'Arove Ghosh',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'arove_ghosh',
  },
  {
    id: 'num-exec-6',
    name: 'Abhigyan Sikdar',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'abhigyan_sikdar',
  },
  {
    id: 'num-exec-7',
    name: 'Swaralipi Choudhury',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'swaralipi_choudhury',
  },
  {
    id: 'num-exec-8',
    name: 'Soumadeep Choudhury',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'soumadeep_choudhury',
  },
  {
    id: 'num-exec-9',
    name: 'Bhavya Kumari',
    role: 'Executive Member',
    tier: 'Executive Members',
    department: 'NUMESCON 2026 Executive Council',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'bhavya_kumari',
  },

  // Food Committee (NUMESCON 2026)
  {
    id: 'num-food-1',
    name: 'Anish Sarkar',
    role: 'Food Committee',
    tier: 'Food Committee',
    department: 'NUMESCON 2026 Hospitality & Catering',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'anish_sarkar',
  },
  {
    id: 'num-food-2',
    name: 'Bhadu Mondal',
    role: 'Food Committee',
    tier: 'Food Committee',
    department: 'NUMESCON 2026 Hospitality & Catering',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'bhadu_mondal',
  },
  {
    id: 'num-food-3',
    name: 'Bhaskar Prasad Singh',
    role: 'Food Committee',
    tier: 'Food Committee',
    department: 'NUMESCON 2026 Hospitality & Catering',
    institution: 'North Bengal Medical College & Hospital (NBMC&H)',
    avatarSeed: 'bhaskar_prasad_singh',
  },
];

export const LEGACY_PHOTOS: LegacyPhoto[] = [];
