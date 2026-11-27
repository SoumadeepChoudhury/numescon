'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  KeyRound,
  LogOut,
  Users,
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  Upload,
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Layers,
  RotateCcw,
  QrCode,
  Eye,
  EyeOff,
  X,
  History,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import {
  EventPosterItem,
  ArchivePhotoItem,
  StudentRegistrationRecord,
  PaymentVerificationStatus,
  INITIAL_POSTERS_DATA,
  INITIAL_ARCHIVE_PHOTOS,
  INITIAL_REGISTRATIONS_DATA,
  DEFAULT_PAYMENT_CONFIG,
  getPosterPages,
} from '@/lib/store';
import { CLUSTERS } from '@/data/conferenceData';
import { compressImageInBrowser, formatBytes } from '@/lib/clientMediaCompression';

interface AdminSession {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('numescon_2026_admin_session');
      if (saved) {
        setAdminUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Auth mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authFullName, setAuthFullName] = useState('');
  const [authRole, setAuthRole] = useState('Organizing Committee Admin · NBMC&H');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard tabs: 'students' | 'posters' | 'archive' | 'trailer' | 'payment'
  const [activeTab, setActiveTab] = useState<
    'students' | 'posters' | 'archive' | 'trailer' | 'payment'
  >('students');

  // Data state
  const [registrations, setRegistrations] = useState<StudentRegistrationRecord[]>(
    INITIAL_REGISTRATIONS_DATA
  );
  const [posters, setPosters] = useState<EventPosterItem[]>(INITIAL_POSTERS_DATA);
  const [archivePhotos, setArchivePhotos] = useState<ArchivePhotoItem[]>(INITIAL_ARCHIVE_PHOTOS);
  const [teaserVideoUrl, setTeaserVideoUrl] = useState<string>('');
  const [teaserVideoTitle, setTeaserVideoTitle] = useState<string>(
    'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar'
  );
  const [paymentQrUrl, setPaymentQrUrl] = useState<string>(
    DEFAULT_PAYMENT_CONFIG.paymentQrUrl || ''
  );
  const [paymentUpiId, setPaymentUpiId] = useState<string>(DEFAULT_PAYMENT_CONFIG.paymentUpiId);
  const [paymentAccountName, setPaymentAccountName] = useState<string>(
    DEFAULT_PAYMENT_CONFIG.paymentAccountName
  );
  const [inspectingReceipt, setInspectingReceipt] = useState<StudentRegistrationRecord | null>(
    null
  );
  const [uploadingBucket, setUploadingBucket] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Student roster filters
  const [clusterFilter, setClusterFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | PaymentVerificationStatus>('ALL');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // New Poster Form State
  const [newPosterTitle, setNewPosterTitle] = useState('');
  const [newPosterCategory, setNewPosterCategory] =
    useState<EventPosterItem['category']>('Official Release');
  const [newPosterTagline, setNewPosterTagline] = useState('');
  const [newPosterDate, setNewPosterDate] = useState('November 28, 2026 · 10:00 AM');
  const [newPosterVenue, setNewPosterVenue] = useState('NBMC&H Auditorium');
  const [newPosterHighlight, setNewPosterHighlight] = useState('Official Release');
  const [newPosterDesc, setNewPosterDesc] = useState('');
  const [newPosterImageUrls, setNewPosterImageUrls] = useState<string[]>([]);
  const [newPosterManualUrl, setNewPosterManualUrl] = useState('');

  // New Archive Photo Form State
  const [newArchiveTitle, setNewArchiveTitle] = useState('');
  const [newArchiveYear, setNewArchiveYear] = useState('2025');
  const [newArchiveCategory, setNewArchiveCategory] =
    useState<ArchivePhotoItem['category']>('Orations');
  const [newArchiveStat, setNewArchiveStat] = useState('');
  const [newArchiveCaption, setNewArchiveCaption] = useState('');
  const [newArchiveImageUrl, setNewArchiveImageUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin-data', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
        }
        if (Array.isArray(data.posters)) {
          setPosters(data.posters);
        }
        if (Array.isArray(data.archivePhotos)) {
          setArchivePhotos(data.archivePhotos);
        }
        if (data.teaserVideoUrl) {
          setTeaserVideoUrl(data.teaserVideoUrl);
        }
        if (data.teaserVideoTitle) {
          setTeaserVideoTitle(data.teaserVideoTitle);
        }
        if (data.paymentQrUrl !== undefined) {
          setPaymentQrUrl(data.paymentQrUrl || '');
        }
        if (data.paymentUpiId) {
          setPaymentUpiId(data.paymentUpiId);
        }
        if (data.paymentAccountName) {
          setPaymentAccountName(data.paymentAccountName);
        }
      })
      .catch((err) => console.error('Failed to fetch admin data:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Auth Handlers (Supabase Auth with local fallback)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: authEmail,
          password: authPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed.');
      } else {
        setAdminUser(data.admin);
        localStorage.setItem('numescon_2026_admin_session', JSON.stringify(data.admin));
      }
    } catch {
      setAuthError('Network error while signing in.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          fullName: authFullName,
          email: authEmail,
          password: authPassword,
          role: authRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Sign up failed.');
      } else {
        setAdminUser(data.admin);
        localStorage.setItem('numescon_2026_admin_session', JSON.stringify(data.admin));
      }
    } catch {
      setAuthError('Network error while creating admin account.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('numescon_2026_admin_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Upload binary media directly to /api/upload with client + server compression (Supabase Storage)
  const uploadFileToStorage = async (
    file: File,
    bucket: 'posters' | 'videos' | 'payment-qr' | 'archive'
  ): Promise<{ url: string; summary: string } | null> => {
    setUploadingBucket(bucket);
    try {
      let uploadTargetFile = file;
      const originalBytes = file.size;

      if (bucket !== 'videos' && bucket !== 'posters' && file.type.startsWith('image/')) {
        const compressed = await compressImageInBrowser(file, bucket);
        uploadTargetFile = compressed.file;
      }

      const fd = new FormData();
      fd.append('file', uploadTargetFile);
      fd.append('bucket', bucket);
      fd.append('originalSize', String(originalBytes));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Upload failed.');
        return null;
      }

      const finalBytes =
        typeof data.compressedBytes === 'number' ? data.compressedBytes : uploadTargetFile.size;
      const savedPct = typeof data.savedPercent === 'number' ? data.savedPercent : 0;
      const summary =
        savedPct > 0
          ? `${formatBytes(originalBytes)} → ${formatBytes(finalBytes)} (${savedPct}% saved)`
          : `${formatBytes(finalBytes)} optimized`;

      return { url: data.url as string, summary };
    } catch {
      showToast('Network error while compressing/uploading file.');
      return null;
    } finally {
      setUploadingBucket(null);
    }
  };

  // Multi-Page Poster Upload Handler (supports selecting 1, 2, or more files together -> WebP compressed)
  const handlePosterFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const maxToAdd = Math.max(0, 6 - newPosterImageUrls.length);
    if (maxToAdd === 0) {
      showToast('Maximum 6 pages per poster reached. Remove a page to add another.');
      return;
    }

    const batch = files.slice(0, maxToAdd);
    const uploadedUrls: string[] = [];
    let lastSummary = '';

    for (const file of batch) {
      const uploaded = await uploadFileToStorage(file, 'posters');
      if (uploaded) {
        uploadedUrls.push(uploaded.url);
        lastSummary = uploaded.summary;
      }
    }

    if (uploadedUrls.length > 0) {
      setNewPosterImageUrls((prev) => [...prev, ...uploadedUrls]);
      showToast(
        uploadedUrls.length === 1
          ? `Poster page compressed & added (${lastSummary})!`
          : `${uploadedUrls.length} poster pages compressed & uploaded! Page 1 is the main cover.`
      );
    }
  };

  const handleAddManualPosterUrl = () => {
    const trimmed = newPosterManualUrl.trim();
    if (!trimmed) return;
    if (newPosterImageUrls.length >= 6) {
      showToast('Maximum 6 pages per poster.');
      return;
    }
    setNewPosterImageUrls((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setNewPosterManualUrl('');
  };

  const handleMoveNewPosterPage = (index: number, direction: -1 | 1) => {
    setNewPosterImageUrls((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleRemoveNewPosterPage = (index: number) => {
    setNewPosterImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosterTitle.trim()) return;

    const finalPages = [...newPosterImageUrls];
    if (newPosterManualUrl.trim() && !finalPages.includes(newPosterManualUrl.trim())) {
      finalPages.push(newPosterManualUrl.trim());
    }

    const created: EventPosterItem = {
      id: `poster-${Date.now()}`,
      title: newPosterTitle.trim(),
      category: newPosterCategory,
      tagline: newPosterTagline.trim() || 'Official NUMESCON 2026 Release · NBMC&H',
      dateStr: newPosterDate.trim() || 'November 28–29, 2026',
      venue: newPosterVenue.trim() || 'NBMC&H Auditorium',
      themeColor: 'from-blue-950 via-slate-900 to-indigo-950',
      badgeBg: 'bg-blue-100 text-blue-900',
      imageUrl: finalPages[0] || undefined,
      imageUrls: finalPages.length > 0 ? finalPages : undefined,
      aspectRatio: '3:4',
      highlightTag: newPosterHighlight.trim() || 'Official Release',
      description:
        newPosterDesc.trim() ||
        'Published by the NUMESCON 2026 Organizing Committee, North Bengal Medical College & Hospital.',
    };

    const updated = [created, ...posters];
    setPosters(updated);
    try {
      await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_posters', posters: updated }),
      });
      showToast(
        finalPages.length > 1
          ? `Multi-page poster (${finalPages.length} pages) published to the portal!`
          : 'New event poster published to the portal!'
      );
      setNewPosterTitle('');
      setNewPosterTagline('');
      setNewPosterDesc('');
      setNewPosterImageUrls([]);
      setNewPosterManualUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePoster = async (posterId: string) => {
    const updated = posters.filter((p) => p.id !== posterId);
    setPosters(updated);
    try {
      await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_posters', posters: updated }),
      });
      showToast('Poster removed from the public gallery.');
    } catch (err) {
      console.error(err);
    }
  };

  const persistUpdatedPosters = async (updated: EventPosterItem[], toastText: string) => {
    setPosters(updated);
    await fetch('/api/admin-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_posters', posters: updated }),
    });
    showToast(toastText);
  };

  const handleUpdateExistingPosterPages = async (
    posterId: string,
    fileList: FileList | null,
    mode: 'append' | 'replace'
  ) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const targetPoster = posters.find((p) => p.id === posterId);
    if (!targetPoster) return;

    const existingPages = mode === 'append' ? getPosterPages(targetPoster) : [];
    const remainingSlots = Math.max(0, 6 - existingPages.length);
    if (remainingSlots === 0) {
      showToast('This poster already has 6 pages.');
      return;
    }

    const uploadedUrls: string[] = [];
    let lastSummary = '';
    for (const file of files.slice(0, remainingSlots)) {
      const uploaded = await uploadFileToStorage(file, 'posters');
      if (uploaded) {
        uploadedUrls.push(uploaded.url);
        lastSummary = uploaded.summary;
      }
    }

    if (uploadedUrls.length === 0) return;

    const nextPages = [...existingPages, ...uploadedUrls];
    const updated = posters.map((p) =>
      p.id === posterId
        ? {
          ...p,
          imageUrl: nextPages[0] || undefined,
          imageUrls: nextPages,
        }
        : p
    );

    await persistUpdatedPosters(
      updated,
      mode === 'append'
        ? `Added ${uploadedUrls.length} page(s) (${nextPages.length} pages total · ${lastSummary})!`
        : `Poster updated with ${nextPages.length} compressed page(s)!`
    );
  };

  const handleRemoveExistingPosterPage = async (posterId: string, pageIndex: number) => {
    const targetPoster = posters.find((p) => p.id === posterId);
    if (!targetPoster) return;
    const nextPages = getPosterPages(targetPoster).filter((_, idx) => idx !== pageIndex);
    const updated = posters.map((p) =>
      p.id === posterId
        ? {
          ...p,
          imageUrl: nextPages[0] || undefined,
          imageUrls: nextPages.length > 0 ? nextPages : undefined,
        }
        : p
    );
    await persistUpdatedPosters(updated, 'Removed page from poster.');
  };

  // Archive Photo Handlers -> Supabase Storage (archive bucket)
  const handleArchiveFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFileToStorage(file, 'archive');
    if (uploaded) {
      setNewArchiveImageUrl(uploaded.url);
      showToast(`Archive photo compressed & uploaded (${uploaded.summary})!`);
    }
  };

  const handleAddArchivePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArchiveTitle.trim() || !newArchiveImageUrl.trim()) {
      showToast('Please provide both a title and an uploaded photo for the archive.');
      return;
    }

    const created: ArchivePhotoItem = {
      id: `arch-${Date.now()}`,
      year: newArchiveYear.trim() || '2025',
      title: newArchiveTitle.trim(),
      category: newArchiveCategory,
      caption:
        newArchiveCaption.trim() ||
        'Verified archival moment from North Bengal Medical College & Hospital.',
      imageUrl: newArchiveImageUrl.trim(),
      highlightStat: newArchiveStat.trim() || undefined,
    };

    const updated = [created, ...archivePhotos];
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_archive_photos', archivePhotos: updated }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save archive photo to database.');
        return;
      }
      setArchivePhotos(Array.isArray(data.archivePhotos) ? data.archivePhotos : updated);
      showToast('New archive photo saved to Supabase and published to the website!');
      setNewArchiveTitle('');
      setNewArchiveStat('');
      setNewArchiveCaption('');
      setNewArchiveImageUrl('');
    } catch (err) {
      console.error(err);
      showToast('Network error while saving archive photo.');
    }
  };

  const handleDeleteArchivePhoto = async (archiveId: string) => {
    const updated = archivePhotos.filter((p) => p.id !== archiveId);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_archive_photos', archivePhotos: updated }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete archive photo.');
        return;
      }
      setArchivePhotos(Array.isArray(data.archivePhotos) ? data.archivePhotos : updated);
      showToast('Archive photo removed from database and storage.');
    } catch (err) {
      console.error(err);
      showToast('Network error while deleting archive photo.');
    }
  };

  const handleReplaceArchiveImage = async (archiveId: string, file: File) => {
    const uploaded = await uploadFileToStorage(file, 'archive');
    if (!uploaded) return;
    const updated = archivePhotos.map((p) =>
      p.id === archiveId ? { ...p, imageUrl: uploaded.url } : p
    );
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_archive_photos', archivePhotos: updated }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update archive photo in database.');
        return;
      }
      setArchivePhotos(Array.isArray(data.archivePhotos) ? data.archivePhotos : updated);
      showToast(`Archive photo compressed & replaced (${uploaded.summary})!`);
    } catch (err) {
      console.error(err);
      showToast('Network error while replacing archive photo.');
    }
  };

  // Trailer Video Handlers -> Supabase Storage (videos bucket)
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFileToStorage(file, 'videos');
    if (uploaded) {
      setTeaserVideoUrl(uploaded.url);
      showToast(
        `Trailer video compressed (${uploaded.summary})! Click "Save & Publish Trailer Video" to go live.`
      );
    }
  };

  const handleSaveTeaserVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_teaser',
          teaserVideoUrl: teaserVideoUrl.trim() || null,
          teaserVideoTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Supabase API Error:', {
          status: res.status,
          response: data,
        });
        showToast(data.error || 'Failed to save trailer video configuration.');
        return;
      }
      setTeaserVideoUrl(data.teaserVideoUrl || '');
      showToast('Trailer video configuration saved and synced to the home page!');
    } catch (err) {
      console.error(err);
      showToast('Network error while saving trailer video.');
    }
  };

  const handleResetTeaserToDefault = async () => {
    const defaultTitle = 'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar';
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_teaser',
          teaserVideoUrl: null,
          teaserVideoTitle: defaultTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to remove published trailer video.');
        return;
      }
      setTeaserVideoUrl('');
      setTeaserVideoTitle(defaultTitle);
      showToast(
        data.storageDeleted
          ? 'Trailer video removed and deleted from storage! The animated Coming Soon stage is now active.'
          : 'Published trailer removed. The animated Coming Soon stage is now active.'
      );
    } catch (err) {
      console.error(err);
      showToast('Network error while removing trailer video.');
    }
  };

  // Payment QR Handlers -> Supabase Storage (payment-qr bucket)
  const handlePaymentQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFileToStorage(file, 'payment-qr');
    if (uploaded) {
      setPaymentQrUrl(uploaded.url);
      showToast(
        `Payment QR optimized (${uploaded.summary})! Click "Save Payment QR Configuration" to publish.`
      );
    }
  };

  const handleSavePaymentQr = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_payment_qr',
          paymentQrUrl: paymentQrUrl.trim() || null,
          paymentUpiId,
          paymentAccountName,
        }),
      });
      showToast('Official Workshop Payment QR & UPI details updated!');
    } catch (err) {
      console.error(err);
    }
  };

  // Verify / Reject student payment receipt
  const handleVerifyPayment = async (
    delegateId: string,
    status: PaymentVerificationStatus,
    remarks?: string
  ) => {
    setVerifyingId(delegateId);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_payment',
          delegateId,
          status,
          verifiedBy: adminUser?.fullName || 'Organizing Committee Admin',
          remarks: remarks ?? '',
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.registrations)) {
        setRegistrations(data.registrations);
        const updatedRecord = (data.registrations as StudentRegistrationRecord[]).find(
          (r) => r.delegateId === delegateId
        );
        if (inspectingReceipt?.delegateId === delegateId && updatedRecord) {
          setInspectingReceipt(updatedRecord);
        }
        showToast(
          status === 'Verified'
            ? `Payment receipt verified for ${delegateId}`
            : status === 'Rejected'
              ? `Payment receipt flagged / rejected for ${delegateId}`
              : `Payment status reset to Pending Review for ${delegateId}`
        );
      } else {
        showToast(data.error || 'Failed to update payment verification status.');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while updating payment verification status.');
    } finally {
      setVerifyingId(null);
    }
  };

  const [togglingIdCard, setTogglingIdCard] = useState<string | null>(null);

  const handleToggleIdCard = async (delegateId: string, nextTaken: boolean) => {
    setTogglingIdCard(delegateId);
    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_id_card',
          delegateId,
          idCardTaken: nextTaken,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.registrations)) {
        setRegistrations(data.registrations);
        showToast(
          nextTaken
            ? `ID Card marked as Taken for ${delegateId}`
            : `ID Card marked as Not Taken for ${delegateId}`
        );
      } else {
        showToast(data.error || 'Failed to update ID card status.');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while updating ID card status.');
    } finally {
      setTogglingIdCard(null);
    }
  };

  const openReceiptInspector = (reg: StudentRegistrationRecord) => {
    setInspectingReceipt(reg);
    setVerificationRemarks(reg.paymentRemarks || '');
  };

  // Delete student registration
  const handleDeleteRegistration = async (delegateId: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete registration ${delegateId}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const updated = registrations.filter((r) => r.delegateId !== delegateId);
    setRegistrations(updated);
    try {
      await fetch('/api/admin-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_registration', delegateId }),
      });
      showToast(`Removed delegate record ${delegateId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Delegate ID',
      'Registration Date',
      'Full Name',
      'College / Institution',
      'Roll Number',
      'Batch',
      'Academic Level',
      'Cluster Track',
      'Payment UTR / Ref',
      'Payment Verification Status',
      'Verified By',
      'Verification Remarks',
      'Email',
      'Phone',
      'City',
      'State',
      'Accommodation',
      'Food Preference',
    ];
    const rows = filteredRegistrations.map((r) => [
      r.delegateId,
      r.registrationDate,
      `${r.title} ${r.fullName}`,
      `"${r.collegeName.replace(/"/g, '""')}"`,
      r.rollNumber,
      r.academicBatch,
      `"${r.academicLevel}"`,
      `Cluster ${r.clusterId} (${CLUSTERS[r.clusterId]?.name ?? ''})`,
      r.paymentTransactionId || 'Pending',
      r.paymentVerificationStatus || 'Pending Review',
      `"${(r.paymentVerifiedBy || '').replace(/"/g, '""')}"`,
      `"${(r.paymentRemarks || '').replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      r.city,
      r.state,
      r.foodPreference,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NUMESCON_2026_Registered_Delegates.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPaymentStatus = (r: StudentRegistrationRecord): PaymentVerificationStatus =>
    r.paymentVerificationStatus || 'Pending Review';

  // Count how many times each normalized email appears
  const emailCounts = registrations.reduce<Record<string, number>>((acc, r) => {
    const key = (r.email || '').trim().toLowerCase();
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const isDuplicateEmail = (email: string) =>
    (emailCounts[(email || '').trim().toLowerCase()] || 0) > 1;

  const duplicateRowsCount = registrations.filter((r) => isDuplicateEmail(r.email)).length;

  const filteredRegistrations = registrations
    .filter((r) => {
      const matchesCluster = clusterFilter === 'ALL' || r.clusterId === clusterFilter;
      const matchesPayment = paymentFilter === 'ALL' || getPaymentStatus(r) === paymentFilter;
      const matchesDuplicate = !showDuplicatesOnly || isDuplicateEmail(r.email);
      const q = studentSearch.toLowerCase();
      const matchesQuery =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.collegeName.toLowerCase().includes(q) ||
        r.delegateId.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        (r.paymentTransactionId || '').toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q);
      return matchesCluster && matchesPayment && matchesDuplicate && matchesQuery;
    })
    .sort((a, b) =>
      showDuplicatesOnly
        ? a.email.trim().toLowerCase().localeCompare(b.email.trim().toLowerCase())
        : 0
    );

  // ============================================================================
  // VIEW 1: NOT AUTHENTICATED -> LOGIN / SIGNUP / FORGOT PASSWORD
  // ============================================================================

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm font-medium text-slate-500">
        Loading Admin Console...
      </main>
    );
  }

  if (!adminUser) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-serif font-bold text-xl">
                N
              </div>
              <div>
                <span className="block font-serif font-extrabold text-lg sm:text-xl text-slate-950 leading-none">
                  NUMESCON 2026 · ADMIN PORTAL
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  North Bengal Medical College & Hospital (NBMC&H)
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <span>← Back to Public Fest Portal</span>
            </Link>
          </div>
        </header>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto px-4 py-12">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-900 block mb-1">
                Authorized Secretariat Access
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-950">
                {authMode === 'login' ? 'Admin Sign In' : 'Create Admin Account'}
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                {authMode === 'login'
                  ? 'Sign in to upload event posters, archive photos, trailer videos, and inspect registered student delegates.'
                  : 'Register a new NUMESCON 2026 Organizing Committee administrator profile.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            {/* <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Sign Up
              </button>
            </div> */}

            {authError && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@numescon2026.org"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer mt-2"
                >
                  {authLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Debojit Das"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="committee@numescon2026.org"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Committee Designation
                  </label>
                  <input
                    type="text"
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Create Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Choose a strong password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer mt-2"
                >
                  {authLoading ? 'Creating Account...' : 'Create Admin Account & Login'}
                </button>
              </form>
            )}

            {/* Helpful Default Admin Credentials Box for quick testing */}
            {/* <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl">
              <strong className="text-slate-800 block mb-1">
                Default NBMC&H Secretariat Account:
              </strong>
              <div className="font-mono text-[11px] space-y-0.5 text-slate-600">
                <div>Email: admin@numescon2026.org</div>
                <div>Password: numescon2026</div>
              </div>
            </div> */}
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          NUMESCON 2026 Restricted Admin Console · North Bengal Medical College & Hospital
        </footer>
      </main>
    );
  }

  // ============================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ============================================================================
  const countCluster = (c: 'A' | 'B' | 'C') =>
    registrations.filter((r) => r.clusterId === c).length;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Admin Navbar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-serif font-black text-xl">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight">
                  NUMESCON 2026 ADMIN CONSOLE
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Authenticated
                </span>
              </div>
              <span className="block text-xs text-slate-400">
                {adminUser.fullName} ({adminUser.email}) · {adminUser.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-sky-300 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-sm font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Dashboard Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-900 block mb-1">
              North Bengal Medical College & Hospital · 28 & 29 Nov 2026
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950">
              Fest Management & Delegate Roster
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setActiveTab('students')}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'students'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <Users className="w-4 h-4 text-blue-900" />
              <span>Registered Students ({registrations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('posters')}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'posters'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <ImageIcon className="w-4 h-4 text-blue-900" />
              <span>Posters ({posters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'archive'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <History className="w-4 h-4 text-amber-700" />
              <span>Archive ({archivePhotos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('trailer')}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'trailer'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <Film className="w-4 h-4 text-rose-700" />
              <span>Trailer Video</span>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'payment'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Payment QR</span>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: REGISTERED STUDENTS FOR CLUSTERS (TABLE VIEW)                 */}
        {/* ==================================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-8">
            {/* Cluster Breakdown KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Total Registered
                </span>
                <span className="font-serif text-3xl font-black text-slate-950 mt-1 block tabular-nums">
                  {registrations.length}
                </span>
                <span className="text-xs text-slate-600 font-semibold mt-1 block tabular-nums">
                  <span className="text-emerald-700">
                    {registrations.filter((r) => getPaymentStatus(r) === 'Verified').length}{' '}
                    Verified
                  </span>{' '}
                  ·{' '}
                  <span className="text-amber-700">
                    {registrations.filter((r) => getPaymentStatus(r) === 'Pending Review').length}{' '}
                    Pending
                  </span>
                </span>
              </div>

              {(['A', 'B', 'C'] as const).map((cid) => (
                <div
                  key={cid}
                  onClick={() => setClusterFilter(clusterFilter === cid ? 'ALL' : cid)}
                  className={`border rounded-2xl p-5 shadow-xs cursor-pointer transition-all ${clusterFilter === cid
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${clusterFilter === cid ? 'text-amber-300' : 'text-blue-900'
                        }`}
                    >
                      Cluster {cid}
                    </span>
                    <Layers className="w-4 h-4 opacity-60" />
                  </div>
                  <span className="font-serif text-3xl font-black mt-1 block tabular-nums">
                    {countCluster(cid)}
                  </span>
                  <span
                    className={`text-xs font-semibold truncate block mt-1 ${clusterFilter === cid ? 'text-slate-200' : 'text-slate-600'
                      }`}
                  >
                    {CLUSTERS[cid].name}
                  </span>
                </div>
              ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  {(['ALL', 'A', 'B', 'C'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setClusterFilter(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${clusterFilter === c
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {c === 'ALL' ? 'All Clusters' : `Cluster ${c} · ${CLUSTERS[c].name}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student, college, UTR, ID..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Payment Receipt Verification Status Filter Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Receipt Status:</span>
                {(['ALL', 'Pending Review', 'Verified', 'Rejected'] as const).map((status) => {
                  const count =
                    status === 'ALL'
                      ? registrations.length
                      : registrations.filter((r) => getPaymentStatus(r) === status).length;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setPaymentFilter(status)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap tabular-nums ${paymentFilter === status
                        ? status === 'Verified'
                          ? 'bg-emerald-800 text-white'
                          : status === 'Rejected'
                            ? 'bg-rose-700 text-white'
                            : status === 'Pending Review'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {status === 'ALL' ? `All Receipts (${count})` : `${status} (${count})`}
                    </button>
                  );
                })}

                {/* NEW: Duplicate Emails Filter Button */}
                <button
                  type="button"
                  onClick={() => setShowDuplicatesOnly((prev) => !prev)}
                  className={`ml-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap tabular-nums inline-flex items-center gap-1.5 ${showDuplicatesOnly
                    ? 'bg-rose-700 text-white'
                    : duplicateRowsCount > 0
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Duplicate Emails ({duplicateRowsCount})</span>
                </button>
              </div>
            </div>

            {/* Registered Students Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-white text-xs uppercase tracking-wider">
                      <th className="py-4 px-5 font-bold">Delegate ID</th>
                      <th className="py-4 px-5 font-bold">Student Name</th>
                      <th className="py-4 px-5 font-bold">Medical College / Institution</th>
                      <th className="py-4 px-5 font-bold">Batch &amp; Roll No</th>
                      <th className="py-4 px-5 font-bold">Assigned Cluster</th>
                      <th className="py-4 px-5 font-bold">Payment Receipt</th>
                      <th className="py-4 px-5 font-bold">ID Card</th>
                      <th className="py-4 px-5 font-bold">Contact Details</th>
                      <th className="py-4 px-5 font-bold">Food</th>
                      <th className="py-4 px-5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-500">
                          No registered students match the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.delegateId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5 align-top">
                            <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md inline-block">
                              {reg.delegateId}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-1">
                              {reg.registrationDate}
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <strong className="text-slate-950 font-bold block">
                              {reg.title} {reg.fullName}
                            </strong>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              {reg.academicLevel}
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top max-w-xs">
                            <span className="font-semibold text-slate-800 block leading-snug">
                              {reg.collegeName}
                            </span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              {reg.city}, {reg.state}
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <span className="font-mono text-xs font-bold text-slate-900 block">
                              {reg.rollNumber}
                            </span>
                            <span className="text-xs text-slate-500 block mt-0.5">
                              {reg.academicBatch} (Adm. {reg.admissionYear})
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-amber-300">
                              Cluster {reg.clusterId} · {CLUSTERS[reg.clusterId]?.name}
                            </span>
                            <span className="block text-xs text-slate-600 mt-1 max-w-[190px] leading-snug">
                              {CLUSTERS[reg.clusterId]?.tagline}
                            </span>
                          </td>



                          <td className="py-4 px-5 align-top text-xs min-w-[210px]">
                            <div className="font-mono font-bold text-slate-900">
                              {reg.paymentTransactionId || 'No UTR provided'}
                            </div>

                            {/* Explicit Verification Status Indicator (Icon + Text) */}
                            <div className="mt-1.5 flex items-center gap-1.5 font-bold">
                              {getPaymentStatus(reg) === 'Verified' && (
                                <span className="inline-flex items-center gap-1 text-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Verified</span>
                                </span>
                              )}
                              {getPaymentStatus(reg) === 'Rejected' && (
                                <span className="inline-flex items-center gap-1 text-rose-700">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span>Rejected</span>
                                </span>
                              )}
                              {getPaymentStatus(reg) === 'Pending Review' && (
                                <span className="inline-flex items-center gap-1 text-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>Pending Review</span>
                                </span>
                              )}
                            </div>

                            {reg.paymentVerifiedBy && getPaymentStatus(reg) !== 'Pending Review' && (
                              <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                                By {reg.paymentVerifiedBy}
                              </div>
                            )}



                            {/* Inspect & Quick Verify Actions */}
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openReceiptInspector(reg)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-bold transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect &amp; Verify</span>
                              </button>

                              {getPaymentStatus(reg) !== 'Verified' && (
                                <button
                                  type="button"
                                  disabled={verifyingId === reg.delegateId}
                                  onClick={() =>
                                    handleVerifyPayment(reg.delegateId, 'Verified', reg.paymentRemarks)
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold transition-colors cursor-pointer"
                                  title="Mark payment receipt as verified"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Verify</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <button
                              type="button"
                              disabled={togglingIdCard === reg.delegateId}
                              onClick={() => handleToggleIdCard(reg.delegateId, !reg.idCardTaken)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 ${reg.idCardTaken
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                            >
                              {reg.idCardTaken ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Taken</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Taken</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-4 px-5 align-top text-xs">
                            <div className="font-medium text-slate-900">{reg.email}</div>
                            <div className="font-mono text-slate-600 mt-0.5">{reg.phone}</div>
                          </td>


                          <td className="py-4 px-5 align-top text-xs">
                            {/* <span className="block font-semibold text-slate-800">
                              {reg.needAccommodation ? 'Hostel Needed' : 'Self Arranged'}
                            </span> */}
                            <span className="text-slate-500 block mt-0.5">
                              {reg.foodPreference}
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top text-right">
                            <button
                              onClick={() => handleDeleteRegistration(reg.delegateId)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Remove registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: EVENT POSTERS & RELEASES MANAGER                              */}
        {/* ==================================================================== */}
        {activeTab === 'posters' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Upload New Poster Form (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs sticky top-24">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      Publish New Poster / Release
                    </h3>
                    <p className="text-xs text-slate-500">
                      Appears immediately in the public Event Posters gallery
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddPoster} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Poster Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Day 2 Schedule Release · 29 November 2026"
                      value={newPosterTitle}
                      onChange={(e) => setNewPosterTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Category
                      </label>
                      <select
                        value={newPosterCategory}
                        onChange={(e) =>
                          setNewPosterCategory(e.target.value as EventPosterItem['category'])
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      >
                        <option value="Competitions">Competitions</option>
                        <option value="Official Release">Official Release</option>
                        <option value="Keynotes">Keynotes</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Cultural">Cultural</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rules Included"
                        value={newPosterHighlight}
                        onChange={(e) => setNewPosterHighlight(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NBMC&H Auditorium · Rules & Judging Criteria Inside"
                      value={newPosterTagline}
                      onChange={(e) => setNewPosterTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Event Date &amp; Time
                      </label>
                      <input
                        type="text"
                        value={newPosterDate}
                        onChange={(e) => setNewPosterDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={newPosterVenue}
                        onChange={(e) => setNewPosterVenue(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* Multi-Page Poster File Uploader (1–2+ files together) */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Upload Poster Pages (Select 1 or 2+ Files Together)
                      </label>
                      {newPosterImageUrls.length > 0 && (
                        <span className="text-[11px] font-bold text-blue-900">
                          {newPosterImageUrls.length} page{newPosterImageUrls.length > 1 ? 's' : ''} attached
                        </span>
                      )}
                    </div>

                    <label className="flex flex-col items-center justify-center gap-1.5 w-full p-4 border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl bg-slate-50 cursor-pointer transition-colors text-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Upload className="w-4 h-4 text-blue-900" />
                        <span>
                          {uploadingBucket === 'posters'
                            ? 'Compressing Pages to WebP & Uploading...'
                            : newPosterImageUrls.length === 0
                              ? 'Select Main Poster + Page 2 Rules Together'
                              : 'Add Another Page (e.g. Page 2 Rules / Details)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Hold Ctrl / Cmd (or select multiple on phone) to upload Page 1 &amp; Page 2 together · Auto-compressed WebP
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePosterFilesUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Ordered Thumbnail Queue for Attached Pages */}
                    {newPosterImageUrls.length > 0 && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800">
                            Page Order (Page 1 = Public Cover)
                          </span>
                          <span>Use arrows to reorder</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {newPosterImageUrls.map((url, idx) => (
                            <div
                              key={`${url}-${idx}`}
                              className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                            >
                              <div className="aspect-[3/4] bg-slate-950 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt={`Poster page ${idx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <span
                                  className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${idx === 0
                                    ? 'bg-blue-900 text-white'
                                    : 'bg-slate-950/85 text-amber-300'
                                    }`}
                                >
                                  {idx === 0 ? 'P1 · Cover' : `P${idx + 1} · Rules`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewPosterPage(idx)}
                                  title="Remove page"
                                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              {newPosterImageUrls.length > 1 && (
                                <div className="flex items-center justify-between px-1.5 py-1 bg-slate-50 border-t border-slate-200">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveNewPosterPage(idx, -1)}
                                    className="p-0.5 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                    title="Move left"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-[10px] font-semibold text-slate-500">
                                    #{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={idx === newPosterImageUrls.length - 1}
                                    onClick={() => handleMoveNewPosterPage(idx, 1)}
                                    className="p-0.5 text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                    title="Move right"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Or Add a Page via Direct Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... or /uploads/posters/..."
                        value={newPosterManualUrl}
                        onChange={(e) => setNewPosterManualUrl(e.target.value)}
                        className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualPosterUrl}
                        className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Description / Key Rules Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Details about this competition or event release..."
                      value={newPosterDesc}
                      onChange={(e) => setNewPosterDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {newPosterImageUrls.length > 1
                      ? `Publish ${newPosterImageUrls.length}-Page Poster to Main Website`
                      : 'Publish Poster to Main Website'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Posters List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {posters.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-slate-900">
                    No Posters Published Yet
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    The public website is currently showing the animated Coming Soon gallery state. Upload single or multi-page (Cover + Page 2 Rules) posters using the form on the left.
                  </p>
                </div>
              ) : (
                posters.map((poster) => {
                  const pages = getPosterPages(poster);
                  return (
                    <div
                      key={poster.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start gap-5"
                    >
                      <div className="relative w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                        {pages[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={pages[0]}
                            alt={poster.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-300 p-2 text-center text-[10px] font-bold">
                            {poster.category}
                          </div>
                        )}
                        {pages.length > 1 && (
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-slate-950/90 text-amber-300 border border-white/15 text-[10px] font-mono font-bold">
                            {pages.length} Pages
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-blue-900">
                              {poster.category}
                            </span>
                            {pages.length > 1 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-900">
                                <Layers className="w-3 h-3" />
                                <span>{pages.length} Pages Attached</span>
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{poster.dateStr}</span>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-slate-950 leading-snug">
                          {poster.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {poster.description}
                        </p>

                        {/* Attached Pages Mini-Strip for Multi-Page Management */}
                        {pages.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {pages.map((pageUrl, pIdx) => (
                              <div
                                key={`${poster.id}-p-${pIdx}`}
                                className="relative group/thumb w-11 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-950"
                                title={`Page ${pIdx + 1}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={pageUrl}
                                  alt={`${poster.title} page ${pIdx + 1}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-mono font-bold text-white text-center leading-tight py-0.5">
                                  P{pIdx + 1}
                                </span>
                                {pages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingPosterPage(poster.id, pIdx)}
                                    title={`Remove Page ${pIdx + 1}`}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-sm bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                              <span>{pages.length === 0 ? 'Add Pages' : 'Add Page 2 / More'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  handleUpdateExistingPosterPages(poster.id, e.target.files, 'append');
                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>

                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5 text-slate-700" />
                              <span>Replace Pages</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  handleUpdateExistingPosterPages(poster.id, e.target.files, 'replace');
                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <button
                            onClick={() => handleDeletePoster(poster.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Release</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2B: ARCHIVE GALLERY MANAGER (PREVIOUS EDITIONS PHOTOS)           */}
        {/* ==================================================================== */}
        {activeTab === 'archive' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Upload Archive Photo Form (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs sticky top-24">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-950">
                      Publish Archival Photo
                    </h3>
                    <p className="text-xs text-slate-500">
                      Appears immediately in the public Archive section
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddArchivePhoto} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Moment Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Keynote at NBMC&H Auditorium"
                      value={newArchiveTitle}
                      onChange={(e) => setNewArchiveTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Edition Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2025"
                        value={newArchiveYear}
                        onChange={(e) => setNewArchiveYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Category
                      </label>
                      <select
                        value={newArchiveCategory}
                        onChange={(e) =>
                          setNewArchiveCategory(e.target.value as ArchivePhotoItem['category'])
                        }
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                      >
                        <option value="Orations">Orations</option>
                        <option value="Clinical Labs">Clinical Labs</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Valedictory">Valedictory</option>
                        <option value="Campus Moments">Campus Moments</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Highlight Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200+ Delegates · NBMC&H"
                      value={newArchiveStat}
                      onChange={(e) => setNewArchiveStat(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Upload Archive Photo (PNG / JPG / WebP) <span className="text-rose-500">*</span>
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl bg-slate-50 cursor-pointer transition-colors text-xs font-bold text-slate-700">
                      <Upload className="w-4 h-4 text-blue-900" />
                      <span>
                        {uploadingBucket === 'archive'
                          ? 'Compressing to WebP & Uploading...'
                          : 'Choose Archive Photo (Auto-Compressed WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleArchiveFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Or Paste Direct Photo URL
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="https://... or /uploads/archive/..."
                      value={newArchiveImageUrl}
                      onChange={(e) => setNewArchiveImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Caption
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Short story or context behind this archival photograph..."
                      value={newArchiveCaption}
                      onChange={(e) => setNewArchiveCaption(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Publish to Archive Gallery
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Archive Photos List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {archivePhotos.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                    <History className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-slate-900">
                    No Archive Photos Published Yet
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    The public Archive section is currently showing the animated Coming Soon stage. Upload your first archival photograph using the form on the left.
                  </p>
                </div>
              ) : (
                archivePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start gap-5"
                  >
                    <div className="w-36 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-blue-900">
                          NUMESCON {photo.year} · {photo.category}
                        </span>
                        {photo.highlightStat && (
                          <span className="text-xs text-slate-500">{photo.highlightStat}</span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-slate-950 leading-snug">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {photo.caption}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-blue-900" />
                          <span>Replace Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReplaceArchiveImage(photo.id, file);
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => handleDeleteArchivePhoto(photo.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: TRAILER & TEASER VIDEO MANAGER                                */}
        {/* ==================================================================== */}
        {activeTab === 'trailer' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-950">
                  Official Trailer & Teaser Video Manager
                </h3>
                <p className="text-sm text-slate-600">
                  Upload an MP4/WebM trailer file or paste a YouTube / direct video link to display on the main landing page.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTeaserVideo} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Trailer Release Title
                </label>
                <input
                  type="text"
                  value={teaserVideoTitle}
                  onChange={(e) => setTeaserVideoTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Upload Trailer Video File from Device (MP4 / WebM)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-blue-900" />
                  <span className="text-sm font-bold text-slate-800">
                    {uploadingBucket === 'videos'
                      ? 'Compressing Video (720p H.264) & Uploading — please wait...'
                      : 'Click to select a video file from your computer'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports MP4, MOV, WebM, or Ogg · Automatically compressed to web-ready 720p H.264 MP4
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Or Paste YouTube / Direct Video Stream URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or https://example.com/trailer.mp4"
                  value={teaserVideoUrl}
                  onChange={(e) => setTeaserVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
                <span className="text-xs text-slate-500 mt-1.5 block">
                  Leave empty to display the animated Coming Soon premiere stage on the main website.
                </span>
              </div>

              {/* Active Trailer Video Preview */}
              {teaserVideoUrl.trim() && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-800">
                      Current Trailer Preview
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      Ready / Active
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video max-h-64">
                    {teaserVideoUrl.includes('youtube.com') ||
                      teaserVideoUrl.includes('youtu.be') ? (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-300 px-4 text-center">
                        YouTube stream configured: {teaserVideoUrl}
                      </div>
                    ) : (
                      <video
                        key={teaserVideoUrl}
                        src={teaserVideoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-slate-950"
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetTeaserToDefault}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Published Trailer Video</span>
                </button>

                <button
                  type="submit"
                  className="px-7 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Save &amp; Publish Trailer Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: WORKSHOP PAYMENT QR CODE MANAGER                              */}
        {/* ==================================================================== */}
        {activeTab === 'payment' && (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-950">
                  Official Workshop Payment QR Code
                </h3>
                <p className="text-sm text-slate-600">
                  Upload the official NBMC&amp;H UPI QR image displayed to students during Step 4 of workshop registration.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePaymentQr} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Account / Payee Display Name
                  </label>
                  <input
                    type="text"
                    value={paymentAccountName}
                    onChange={(e) => setPaymentAccountName(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Official UPI ID
                  </label>
                  <input
                    type="text"
                    value={paymentUpiId}
                    onChange={(e) => setPaymentUpiId(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Upload Official UPI QR Image (PNG / JPG)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-blue-900" />
                  <span className="text-sm font-bold text-slate-800">
                    {uploadingBucket === 'payment-qr'
                      ? 'Optimizing Payment QR & Uploading...'
                      : 'Click to upload official UPI QR code screenshot'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Auto-optimized crisp WebP displayed in Step 4 of student registration
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePaymentQrFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {paymentQrUrl && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-5">
                  <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={paymentQrUrl}
                      alt="Uploaded Payment QR Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <strong className="text-slate-900 block text-sm">
                      Custom Payment QR Active
                    </strong>
                    <p>Students will scan this exact QR code during workshop registration.</p>
                    <button
                      type="button"
                      onClick={() => setPaymentQrUrl('')}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove custom QR image
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Save Payment QR Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modal: Inspect & Verify Student Payment Receipt */}
      {inspectingReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs"
          onClick={() => setInspectingReceipt(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  PAYMENT RECEIPT VERIFICATION · {inspectingReceipt.delegateId}
                </span>
                <span className="text-sm font-bold text-white">
                  {inspectingReceipt.title} {inspectingReceipt.fullName} · Cluster{' '}
                  {inspectingReceipt.clusterId} ({CLUSTERS[inspectingReceipt.clusterId]?.name})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingReceipt(null)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close receipt view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Screenshot Viewer + Verification Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
              {/* Left: Uploaded Receipt Screenshot */}
              <div className="lg:col-span-7 p-5 sm:p-6 bg-slate-900 flex flex-col items-center justify-center min-h-[300px]">
                {inspectingReceipt.paymentReceiptUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={inspectingReceipt.paymentReceiptUrl}
                      alt={`Payment receipt from ${inspectingReceipt.fullName}`}
                      referrerPolicy="no-referrer"
                      className="max-h-[60vh] w-auto object-contain rounded-xl border border-white/10 shadow-lg"
                    />
                    <a
                      href={inspectingReceipt.paymentReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full-Resolution Screenshot in New Tab</span>
                    </a>
                  </>
                ) : (
                  <div className="text-center p-8 border border-dashed border-slate-700 rounded-2xl max-w-sm">
                    <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-200">
                      No Screenshot Attached on This Record
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      This is a pre-seeded sample record ({inspectingReceipt.paymentReceiptName || 'sample'}). All newly submitted student registrations include their uploaded receipt screenshot here.
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Audit Details & Verification Decision */}
              <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-slate-200">
                <div className="space-y-4 text-xs">
                  {/* Current Verification Status Banner */}
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center gap-2.5 font-bold ${getPaymentStatus(inspectingReceipt) === 'Verified'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : getPaymentStatus(inspectingReceipt) === 'Rejected'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                  >
                    {getPaymentStatus(inspectingReceipt) === 'Verified' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {getPaymentStatus(inspectingReceipt) === 'Rejected' && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    {getPaymentStatus(inspectingReceipt) === 'Pending Review' && (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <div>Status: {getPaymentStatus(inspectingReceipt)}</div>
                      {inspectingReceipt.paymentVerifiedBy &&
                        getPaymentStatus(inspectingReceipt) !== 'Pending Review' && (
                          <div className="text-[11px] font-medium opacity-80 mt-0.5">
                            Reviewed by {inspectingReceipt.paymentVerifiedBy}
                            {inspectingReceipt.paymentVerifiedAt
                              ? ` · ${inspectingReceipt.paymentVerifiedAt}`
                              : ''}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Transaction & Student Metadata */}
                  <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">UPI UTR / Ref ID:</span>
                      <span className="font-mono font-bold text-slate-950 text-right">
                        {inspectingReceipt.paymentTransactionId || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Delegate Name:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {inspectingReceipt.title} {inspectingReceipt.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Institution:</span>
                      <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">
                        {inspectingReceipt.collegeName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Phone / Email:</span>
                      <span className="font-mono text-slate-800 text-right">
                        {inspectingReceipt.phone}
                      </span>
                    </div>
                    {inspectingReceipt.paymentReceiptName && (
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Uploaded File:</span>
                        <span className="text-slate-700 text-right truncate max-w-[180px]">
                          {inspectingReceipt.paymentReceiptName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Admin Verification Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Committee Verification Remarks (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. UTR matched in SBI bank statement / Screenshot unclear..."
                      value={verificationRemarks}
                      onChange={(e) => setVerificationRemarks(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={verifyingId === inspectingReceipt.delegateId}
                    onClick={() =>
                      handleVerifyPayment(
                        inspectingReceipt.delegateId,
                        'Verified',
                        verificationRemarks
                      )
                    }
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {verifyingId === inspectingReceipt.delegateId
                        ? 'Updating...'
                        : 'Approve & Mark Payment Verified'}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={verifyingId === inspectingReceipt.delegateId}
                      onClick={() =>
                        handleVerifyPayment(
                          inspectingReceipt.delegateId,
                          'Rejected',
                          verificationRemarks
                        )
                      }
                      className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject / Flag</span>
                    </button>

                    <button
                      type="button"
                      disabled={verifyingId === inspectingReceipt.delegateId}
                      onClick={() =>
                        handleVerifyPayment(
                          inspectingReceipt.delegateId,
                          'Pending Review',
                          verificationRemarks
                        )
                      }
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mark Pending</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
