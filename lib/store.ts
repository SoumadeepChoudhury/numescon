import { ClusterId } from '@/data/conferenceData';

export interface EventPosterItem {
  id: string;
  title: string;
  category: 'Keynotes' | 'Workshops' | 'Competitions' | 'Cultural' | 'Official Release';
  tagline: string;
  dateStr: string;
  venue: string;
  themeColor: string;
  badgeBg: string;
  imageUrl?: string;
  imageUrls?: string[];
  aspectRatio: string;
  highlightTag?: string;
  description: string;
}

export function getPosterPages(poster: Pick<EventPosterItem, 'imageUrl' | 'imageUrls'>): string[] {
  const collected: string[] = [];
  if (Array.isArray(poster.imageUrls)) {
    for (const url of poster.imageUrls) {
      const trimmed = typeof url === 'string' ? url.trim() : '';
      if (trimmed && !collected.includes(trimmed)) {
        collected.push(trimmed);
      }
    }
  }
  if (poster.imageUrl && poster.imageUrl.trim()) {
    const primary = poster.imageUrl.trim();
    if (!collected.includes(primary)) {
      collected.unshift(primary);
    }
  }
  return collected;
}

export type PaymentVerificationStatus = 'Pending Review' | 'Verified' | 'Rejected';

export interface StudentRegistrationRecord {
  delegateId: string;
  registrationDate: string;
  title: string;
  fullName: string;
  collegeName: string;
  rollNumber: string;
  admissionYear: string;
  academicBatch: string;
  academicLevel: string;
  email: string;
  phone: string;
  gender: string;
  state: string;
  city: string;
  foodPreference: string;
  clusterId: ClusterId;
  paymentTransactionId?: string;
  paymentReceiptUrl?: string;
  paymentReceiptName?: string;
  paymentVerificationStatus?: PaymentVerificationStatus;
  paymentVerifiedBy?: string;
  paymentVerifiedAt?: string;
  paymentRemarks?: string;
}

export interface PaymentQrConfig {
  paymentQrUrl: string | null;
  paymentUpiId: string;
  paymentAccountName: string;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentQrConfig = {
  paymentQrUrl: 'https://ozojenmluhcnekupjnfe.supabase.co/storage/v1/object/public/payment-qr/1795162040987-9fo39q-whatsapp-image-2026-11-19-at-19.52.42.webp',
  paymentUpiId: 'northbengalmedicalcollegeplasmacommittee@sbi',
  paymentAccountName: 'NUMESCON 2026 Workshop Committee · NBMC&H',
};

export interface AdminUserAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  securityPin: string;
}

export interface ArchivePhotoItem {
  id: string;
  year: string;
  title: string;
  category: 'Orations' | 'Clinical Labs' | 'Hackathon' | 'Valedictory' | 'Campus Moments';
  caption: string;
  imageUrl: string;
  highlightStat?: string;
}

export const INITIAL_POSTERS_DATA: EventPosterItem[] = [];
export const INITIAL_ARCHIVE_PHOTOS: ArchivePhotoItem[] = [];

export const INITIAL_REGISTRATIONS_DATA: StudentRegistrationRecord[] = [
  {
    delegateId: 'NUMES-2026-A4812',
    registrationDate: 'Nov 15, 2026',
    title: 'Ms.',
    fullName: 'Ananya Chatterjee',
    collegeName: 'North Bengal Medical College & Hospital (NBMC&H)',
    rollNumber: 'NBMC-2022-041',
    admissionYear: '2022',
    academicBatch: 'Batch 2022',
    academicLevel: '3rd Year MBBS / Health Sciences',
    email: 'ananya.chatterjee@nbmch.ac.in',
    phone: '9832411209',
    gender: 'Female',
    state: 'West Bengal',
    city: 'Siliguri',
    foodPreference: 'Non-Vegetarian',
    clusterId: 'A',
    paymentTransactionId: 'UTR432189045120',
    paymentReceiptName: 'upi_receipt_ananya.jpg',
    paymentVerificationStatus: 'Pending Review',
  },
  {
    delegateId: 'NUMES-2026-B7390',
    registrationDate: 'Nov 16, 2026',
    title: 'Mr.',
    fullName: 'Sagnik Mukhopadhyay',
    collegeName: 'Medical College and Hospital, Kolkata (MCK)',
    rollNumber: 'MCK-2021-118',
    admissionYear: '2021',
    academicBatch: 'Batch 2021',
    academicLevel: 'Final Year MBBS / Health Sciences',
    email: 'sagnik.m@mckolkata.edu.in',
    phone: '9433187654',
    gender: 'Male',
    state: 'West Bengal',
    city: 'Kolkata',
    foodPreference: 'Non-Vegetarian',
    clusterId: 'B',
    paymentTransactionId: 'UTR432276418902',
    paymentReceiptName: 'gpay_receipt_sagnik.png',
    paymentVerificationStatus: 'Pending Review',
  },
  {
    delegateId: 'NUMES-2026-C5104',
    registrationDate: 'Nov 17, 2026',
    title: 'Ms.',
    fullName: 'Rituparna Sengupta',
    collegeName: 'Nil Ratan Sircar Medical College & Hospital (NRSMC&H)',
    rollNumber: 'NRS-2023-074',
    admissionYear: '2023',
    academicBatch: 'Batch 2023',
    academicLevel: '2nd Year Undergraduate',
    email: 'rituparna.s@nrsmc.edu.in',
    phone: '9874501238',
    gender: 'Female',
    state: 'West Bengal',
    city: 'Kolkata',
    foodPreference: 'Vegetarian',
    clusterId: 'C',
    paymentTransactionId: 'UTR432350912448',
    paymentReceiptName: 'phonepe_receipt_rituparna.jpg',
    paymentVerificationStatus: 'Pending Review',
  },
  {
    delegateId: 'NUMES-2026-A6291',
    registrationDate: 'Nov 18, 2026',
    title: 'Mr.',
    fullName: 'Debjit Roy Barman',
    collegeName: 'North Bengal Medical College & Hospital (NBMC&H)',
    rollNumber: 'NBMC-2021-019',
    admissionYear: '2021',
    academicBatch: 'Batch 2021',
    academicLevel: 'Final Year MBBS / Health Sciences',
    email: 'debjit.roy@nbmch.ac.in',
    phone: '9733098412',
    gender: 'Male',
    state: 'West Bengal',
    city: 'Jalpaiguri',
    foodPreference: 'Non-Vegetarian',
    clusterId: 'A',
    paymentTransactionId: 'UTR432490871135',
    paymentReceiptName: 'paytm_receipt_debjit.png',
    paymentVerificationStatus: 'Pending Review',
  },
];
