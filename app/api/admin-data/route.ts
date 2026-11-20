import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  EventPosterItem,
  ArchivePhotoItem,
  StudentRegistrationRecord,
  PaymentVerificationStatus,
  AdminUserAccount,
  INITIAL_POSTERS_DATA,
  INITIAL_ARCHIVE_PHOTOS,
  INITIAL_REGISTRATIONS_DATA,
  DEFAULT_PAYMENT_CONFIG,
  getPosterPages,
} from '@/lib/store';
import {
  createSupabaseAuthClient,
  deleteMediaFromSupabaseByUrl,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from '@/lib/supabaseServer';
import { ClusterId } from '@/data/conferenceData';

export const dynamic = 'force-dynamic';

interface PersistedDatabase {
  posters: EventPosterItem[];
  archivePhotos: ArchivePhotoItem[];
  teaserVideoUrl: string | null;
  teaserVideoTitle: string;
  paymentQrUrl: string | null;
  paymentUpiId: string;
  paymentAccountName: string;
  registrations: StudentRegistrationRecord[];
  admins: AdminUserAccount[];
}

const DB_FILE_PATH = path.join('/tmp', 'numescon_2026_portal_db_v4.json');

const DEFAULT_ADMINS: AdminUserAccount[] = [
  {
    id: 'adm-1',
    fullName: 'NBMC Organizing Secretariat',
    email: 'admin@numescon2026.org',
    password: 'numescon2026',
    role: 'Chief Admin · NBMC&H',
    securityPin: '2026',
  },
];

// ============================================================================
// LOCAL FALLBACK HELPERS (Used when Supabase env vars are not yet set)
// ============================================================================

function readLocalDb(): PersistedDatabase {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PersistedDatabase>;
      return {
        posters: Array.isArray(parsed.posters) ? parsed.posters : [],
        archivePhotos: Array.isArray(parsed.archivePhotos) ? parsed.archivePhotos : [],
        teaserVideoUrl: parsed.teaserVideoUrl ?? null,
        teaserVideoTitle:
          parsed.teaserVideoTitle ?? 'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar',
        paymentQrUrl: parsed.paymentQrUrl ?? DEFAULT_PAYMENT_CONFIG.paymentQrUrl,
        paymentUpiId: parsed.paymentUpiId ?? DEFAULT_PAYMENT_CONFIG.paymentUpiId,
        paymentAccountName:
          parsed.paymentAccountName ?? DEFAULT_PAYMENT_CONFIG.paymentAccountName,
        registrations:
          Array.isArray(parsed.registrations) && parsed.registrations.length > 0
            ? parsed.registrations
            : INITIAL_REGISTRATIONS_DATA,
        admins:
          Array.isArray(parsed.admins) && parsed.admins.length > 0
            ? parsed.admins
            : DEFAULT_ADMINS,
      };
    }
  } catch (err) {
    console.error('Failed to read local DB file:', err);
  }
  const initial: PersistedDatabase = {
    posters: INITIAL_POSTERS_DATA,
    archivePhotos: INITIAL_ARCHIVE_PHOTOS,
    teaserVideoUrl: null,
    teaserVideoTitle: 'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar',
    paymentQrUrl: DEFAULT_PAYMENT_CONFIG.paymentQrUrl,
    paymentUpiId: DEFAULT_PAYMENT_CONFIG.paymentUpiId,
    paymentAccountName: DEFAULT_PAYMENT_CONFIG.paymentAccountName,
    registrations: INITIAL_REGISTRATIONS_DATA,
    admins: DEFAULT_ADMINS,
  };
  writeLocalDb(initial);
  return initial;
}

function writeLocalDb(data: PersistedDatabase) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local DB file:', err);
  }
}

// ============================================================================
// SUPABASE ROW MAPPERS
// ============================================================================

interface DbPosterRow {
  id: string;
  title: string;
  category: EventPosterItem['category'];
  tagline: string;
  date_str: string;
  venue: string;
  theme_color: string;
  badge_bg: string;
  image_url: string | null;
  image_urls?: string[] | null;
  aspect_ratio: string;
  highlight_tag: string | null;
  description: string;
}


function mapPosterFromDb(row: DbPosterRow): EventPosterItem {
  const pages = getPosterPages({
    imageUrl: row.image_url || undefined,
    imageUrls: Array.isArray(row.image_urls) ? row.image_urls : undefined,
  });
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    tagline: row.tagline,
    dateStr: row.date_str,
    venue: row.venue,
    themeColor: row.theme_color,
    badgeBg: row.badge_bg,
    imageUrl: pages[0] || undefined,
    imageUrls: pages.length > 0 ? pages : undefined,
    aspectRatio: row.aspect_ratio,
    highlightTag: row.highlight_tag || undefined,
    description: row.description,
  };
}

interface DbArchiveRow {
  id: string;
  year: string;
  title: string;
  category: ArchivePhotoItem['category'];
  caption: string;
  image_url: string;
  highlight_tag: string | null;
}

function mapArchiveFromDb(row: DbArchiveRow): ArchivePhotoItem {
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    category: row.category,
    caption: row.caption,
    imageUrl: row.image_url,
    highlightStat: row.highlight_tag || undefined,
  };
}

function mapArchiveToDb(item: ArchivePhotoItem): DbArchiveRow {
  return {
    id: item.id,
    year: item.year || '2025',
    title: item.title,
    category: item.category || 'Campus Moments',
    caption: item.caption || '',
    image_url: item.imageUrl,
    highlight_tag: item.highlightStat || null,
  };
}

function mapPosterToDb(p: EventPosterItem): DbPosterRow {
  const pages = getPosterPages(p);
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    tagline: p.tagline || '',
    date_str: p.dateStr || '',
    venue: p.venue || '',
    theme_color: p.themeColor || 'from-blue-950 via-slate-900 to-indigo-950',
    badge_bg: p.badgeBg || 'bg-blue-100 text-blue-900',
    image_url: pages[0] || null,
    image_urls: pages,
    aspect_ratio: p.aspectRatio || '3:4',
    highlight_tag: p.highlightTag || null,
    description: p.description || '',
  };
}

interface DbRegistrationRow {
  delegate_id: string;
  registration_date: string;
  title: string;
  full_name: string;
  college_name: string;
  roll_number: string;
  admission_year: string;
  academic_batch: string;
  academic_level: string;
  email: string;
  phone: string;
  gender: string;
  state: string;
  city: string;
  food_preference: string;
  cluster_id: ClusterId;
  payment_transaction_id: string;
  payment_receipt_url: string;
  payment_receipt_name: string | null;
  payment_verification_status?: PaymentVerificationStatus | null;
  payment_verified_by?: string | null;
  payment_verified_at?: string | null;
  payment_remarks?: string | null;
}

function mapRegistrationFromDb(row: DbRegistrationRow): StudentRegistrationRecord {
  return {
    delegateId: row.delegate_id,
    registrationDate: row.registration_date,
    title: row.title || 'Mr.',
    fullName: row.full_name,
    collegeName: row.college_name,
    rollNumber: row.roll_number,
    admissionYear: row.admission_year,
    academicBatch: row.academic_batch,
    academicLevel: row.academic_level,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    state: row.state,
    city: row.city,
    foodPreference: row.food_preference,
    clusterId: row.cluster_id,
    paymentTransactionId: row.payment_transaction_id,
    paymentReceiptUrl: row.payment_receipt_url,
    paymentReceiptName: row.payment_receipt_name || undefined,
    paymentVerificationStatus: row.payment_verification_status || 'Pending Review',
    paymentVerifiedBy: row.payment_verified_by || undefined,
    paymentVerifiedAt: row.payment_verified_at || undefined,
    paymentRemarks: row.payment_remarks || undefined,
  };
}

function mapRegistrationToDb(r: StudentRegistrationRecord): DbRegistrationRow {
  return {
    delegate_id: r.delegateId,
    registration_date: r.registrationDate,
    title: r.title || 'Mr.',
    full_name: r.fullName,
    college_name: r.collegeName,
    roll_number: r.rollNumber,
    admission_year: r.admissionYear,
    academic_batch: r.academicBatch,
    academic_level: r.academicLevel,
    email: r.email,
    phone: r.phone,
    gender: r.gender,
    state: r.state,
    city: r.city,
    food_preference: r.foodPreference,
    cluster_id: r.clusterId,
    payment_transaction_id: r.paymentTransactionId || '',
    payment_receipt_url: r.paymentReceiptUrl || '',
    payment_receipt_name: r.paymentReceiptName || null,
    payment_verification_status: r.paymentVerificationStatus || 'Pending Review',
    payment_verified_by: r.paymentVerifiedBy || null,
    payment_verified_at: r.paymentVerifiedAt || null,
    payment_remarks: r.paymentRemarks || null,
  };
}

// ============================================================================
// GET /api/admin-data
// ============================================================================

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()!;

      const [postersRes, archiveRes, configRes, regsRes] = await Promise.all([
        supabase.from('event_posters').select('*').order('created_at', { ascending: false }),
        supabase.from('archive_photos').select('*').order('created_at', { ascending: false }),
        supabase.from('site_media_config').select('*').eq('id', 1).maybeSingle(),
        supabase.from('student_registrations').select('*').order('created_at', { ascending: false }),
      ]);

      const posters: EventPosterItem[] =
        !postersRes.error && Array.isArray(postersRes.data)
          ? (postersRes.data as DbPosterRow[]).map(mapPosterFromDb)
          : [];

      const archivePhotos: ArchivePhotoItem[] =
        !archiveRes.error && Array.isArray(archiveRes.data)
          ? (archiveRes.data as DbArchiveRow[]).map(mapArchiveFromDb)
          : [];

      const configRow = configRes.data as {
        teaser_video_url?: string | null;
        teaser_video_title?: string;
        payment_qr_url?: string | null;
        payment_upi_id?: string;
        payment_account_name?: string;
      } | null;

      const registrations: StudentRegistrationRecord[] =
        !regsRes.error && Array.isArray(regsRes.data)
          ? (regsRes.data as DbRegistrationRow[]).map(mapRegistrationFromDb)
          : [];

      return NextResponse.json(
        {
          posters,
          archivePhotos,
          teaserVideoUrl: configRow?.teaser_video_url ?? null,
          teaserVideoTitle:
            configRow?.teaser_video_title ??
            'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar',
          paymentQrUrl: configRow?.payment_qr_url ?? DEFAULT_PAYMENT_CONFIG.paymentQrUrl,
          paymentUpiId: configRow?.payment_upi_id ?? DEFAULT_PAYMENT_CONFIG.paymentUpiId,
          paymentAccountName:
            configRow?.payment_account_name ?? DEFAULT_PAYMENT_CONFIG.paymentAccountName,
          registrations,
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    } catch (err) {
      console.error('Supabase GET error, falling back to local store:', err);
    }
  }

  const db = readLocalDb();
  return NextResponse.json(
    {
      posters: db.posters,
      archivePhotos: db.archivePhotos,
      teaserVideoUrl: db.teaserVideoUrl,
      teaserVideoTitle: db.teaserVideoTitle,
      paymentQrUrl: db.paymentQrUrl,
      paymentUpiId: db.paymentUpiId,
      paymentAccountName: db.paymentAccountName,
      registrations: db.registrations,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

// ============================================================================
// POST /api/admin-data
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ------------------------------------------------------------------------
    // SUPABASE POSTGRESQL MODE
    // ------------------------------------------------------------------------
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()!;

      if (action === 'login') {
        const cleanEmail = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        if (!cleanEmail || !password) {
          return NextResponse.json(
            { error: 'Email and password are required.' },
            { status: 400 }
          );
        }

        const authClient = createSupabaseAuthClient()!;
        const { data, error } = await authClient.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error || !data.user) {
          return NextResponse.json(
            {
              error:
                error?.message ||
                'Invalid email or password. Please verify your credentials or create an account via Sign Up.',
            },
            { status: 401 }
          );
        }

        const meta = (data.user.user_metadata || {}) as {
          full_name?: string;
          role?: string;
        };

        return NextResponse.json({
          authProvider: 'supabase',
          admin: {
            id: data.user.id,
            fullName: meta.full_name || cleanEmail.split('@')[0],
            email: data.user.email || cleanEmail,
            role: meta.role || 'Organizing Committee Admin · NBMC&H',
          },
        });
      }

      if (action === 'signup') {
        const { fullName, email, password, role } = body;
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPassword = String(password || '');
        const cleanName = String(fullName || '').trim();
        const newRole = String(role || 'Organizing Committee Admin · NBMC&H').trim();

        if (!cleanEmail || !cleanPassword || !cleanName) {
          return NextResponse.json(
            { error: 'Full name, email, and password are required.' },
            { status: 400 }
          );
        }

        if (cleanPassword.length < 6) {
          return NextResponse.json(
            { error: 'Password must be at least 6 characters long.' },
            { status: 400 }
          );
        }

        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: cleanPassword,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            role: newRole,
          },
        });

        if (createErr || !created.user) {
          const alreadyExists = createErr?.message?.toLowerCase().includes('already');
          return NextResponse.json(
            { error: createErr?.message || 'Unable to create Supabase Auth admin account.' },
            { status: alreadyExists ? 409 : 400 }
          );
        }

        // Mirror profile metadata to public.admin_users if table exists (non-fatal)
        await supabase
          .from('admin_users')
          .upsert({
            id: created.user.id,
            full_name: cleanName,
            email: cleanEmail,
            password_hash: 'managed_by_supabase_auth',
            role: newRole,
            security_pin: '2026',
          })
          .then(() => undefined, () => undefined);

        return NextResponse.json({
          authProvider: 'supabase',
          admin: {
            id: created.user.id,
            fullName: cleanName,
            email: created.user.email || cleanEmail,
            role: newRole,
          },
        });
      }

      if (action === 'add_registration') {
        const { registration } = body as { registration: StudentRegistrationRecord };
        if (!registration || !registration.delegateId) {
          return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 });
        }
        if (!registration.paymentReceiptUrl || !registration.paymentTransactionId?.trim()) {
          return NextResponse.json(
            {
              error:
                'Payment receipt screenshot and transaction ID are required to complete workshop registration.',
            },
            { status: 400 }
          );
        }

        const { error: upsertErr } = await supabase
          .from('student_registrations')
          .upsert(mapRegistrationToDb(registration));

        if (upsertErr) {
          return NextResponse.json({ error: upsertErr.message }, { status: 500 });
        }

        const { data: rows } = await supabase
          .from('student_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        return NextResponse.json({
          registrations: Array.isArray(rows)
            ? (rows as DbRegistrationRow[]).map(mapRegistrationFromDb)
            : [],
        });
      }

      if (action === 'verify_payment') {
        const { delegateId, status, verifiedBy, remarks } = body as {
          delegateId: string;
          status: PaymentVerificationStatus;
          verifiedBy?: string;
          remarks?: string;
        };
        const allowed: PaymentVerificationStatus[] = ['Pending Review', 'Verified', 'Rejected'];
        if (!delegateId || !allowed.includes(status)) {
          return NextResponse.json(
            { error: 'Valid delegateId and verification status are required.' },
            { status: 400 }
          );
        }

        const verifiedAt =
          status === 'Pending Review'
            ? null
            : new Date().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

        const { error: updateErr } = await supabase
          .from('student_registrations')
          .update({
            payment_verification_status: status,
            payment_verified_by: status === 'Pending Review' ? null : verifiedBy || 'Admin',
            payment_verified_at: verifiedAt,
            payment_remarks: remarks ? String(remarks).trim() : null,
          })
          .eq('delegate_id', delegateId);

        if (updateErr) {
          return NextResponse.json({ error: updateErr.message }, { status: 500 });
        }

        const { data: rows } = await supabase
          .from('student_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        return NextResponse.json({
          registrations: Array.isArray(rows)
            ? (rows as DbRegistrationRow[]).map(mapRegistrationFromDb)
            : [],
        });
      }

      if (action === 'delete_registration') {
        const { delegateId } = body;
        await supabase.from('student_registrations').delete().eq('delegate_id', delegateId);

        const { data: rows } = await supabase
          .from('student_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        return NextResponse.json({
          registrations: Array.isArray(rows)
            ? (rows as DbRegistrationRow[]).map(mapRegistrationFromDb)
            : [],
        });
      }

      if (action === 'save_posters') {
        const { posters } = body as { posters: EventPosterItem[] };
        if (Array.isArray(posters)) {
          const { data: existingRows } = await supabase.from('event_posters').select('id');
          const nextIds = new Set(posters.map((p) => p.id));
          const idsToDelete = (existingRows || [])
            .map((r: { id: string }) => r.id)
            .filter((id) => !nextIds.has(id));

          if (idsToDelete.length > 0) {
            await supabase.from('event_posters').delete().in('id', idsToDelete);
          }

          if (posters.length > 0) {
            const payload = posters.map(mapPosterToDb);
            const { error: upsertErr } = await supabase.from('event_posters').upsert(payload);
            // Graceful fallback if existing Supabase table hasn't added image_urls column yet
            if (upsertErr && upsertErr.message?.includes('image_urls')) {
              const legacyPayload = payload.map((row) => {
                const { image_urls: _omit, ...rest } = row;
                void _omit;
                return rest;
              });
              await supabase.from('event_posters').upsert(legacyPayload);
            }
          }
        }

        const { data: refreshed } = await supabase
          .from('event_posters')
          .select('*')
          .order('created_at', { ascending: false });

        return NextResponse.json({
          posters: Array.isArray(refreshed)
            ? (refreshed as DbPosterRow[]).map(mapPosterFromDb)
            : [],
        });
      }

      if (action === 'save_archive_photos') {
        const { archivePhotos } = body as { archivePhotos: ArchivePhotoItem[] };
        if (Array.isArray(archivePhotos)) {
          const { data: existingRows } = await supabase.from('archive_photos').select('id');
          const nextIds = new Set(archivePhotos.map((p) => p.id));
          const idsToDelete = (existingRows || [])
            .map((r: { id: string }) => r.id)
            .filter((id) => !nextIds.has(id));

          if (idsToDelete.length > 0) {
            await supabase.from('archive_photos').delete().in('id', idsToDelete);
          }

          if (archivePhotos.length > 0) {
            await supabase.from('archive_photos').upsert(archivePhotos.map(mapArchiveToDb));
          }
        }

        const { data: refreshed } = await supabase
          .from('archive_photos')
          .select('*')
          .order('created_at', { ascending: false });

        return NextResponse.json({
          archivePhotos: Array.isArray(refreshed)
            ? (refreshed as DbArchiveRow[]).map(mapArchiveFromDb)
            : [],
        });
      }

      if (action === 'save_teaser') {
        const teaserVideoUrl = body.teaserVideoUrl ? String(body.teaserVideoUrl).trim() : null;
        const teaserVideoTitle = body.teaserVideoTitle
          ? String(body.teaserVideoTitle).trim()
          : 'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar';

        // Check existing trailer URL so removed/replaced storage videos are deleted to free quota
        const { data: prevConfig } = await supabase
          .from('site_media_config')
          .select('teaser_video_url')
          .eq('id', 1)
          .maybeSingle();
        const prevUrl = (prevConfig as { teaser_video_url?: string | null } | null)
          ?.teaser_video_url;

        const { error: upsertErr } = await supabase.from('site_media_config').upsert({
          id: 1,
          teaser_video_url: teaserVideoUrl,
          teaser_video_title: teaserVideoTitle,
          updated_at: new Date().toISOString(),
        });

        if (upsertErr) {
          return NextResponse.json({ error: upsertErr.message }, { status: 500 });
        }

        let storageDeleted = false;
        if (prevUrl && prevUrl !== teaserVideoUrl) {
          storageDeleted = await deleteMediaFromSupabaseByUrl(prevUrl, 'videos');
        }

        return NextResponse.json({
          teaserVideoUrl,
          teaserVideoTitle,
          storageDeleted,
        });
      }

      if (action === 'save_payment_qr') {
        const paymentQrUrl = body.paymentQrUrl ? String(body.paymentQrUrl).trim() : null;
        const paymentUpiId = body.paymentUpiId
          ? String(body.paymentUpiId).trim()
          : DEFAULT_PAYMENT_CONFIG.paymentUpiId;
        const paymentAccountName = body.paymentAccountName
          ? String(body.paymentAccountName).trim()
          : DEFAULT_PAYMENT_CONFIG.paymentAccountName;

        await supabase.from('site_media_config').upsert({
          id: 1,
          payment_qr_url: paymentQrUrl,
          payment_upi_id: paymentUpiId,
          payment_account_name: paymentAccountName,
          updated_at: new Date().toISOString(),
        });

        return NextResponse.json({
          paymentQrUrl,
          paymentUpiId,
          paymentAccountName,
        });
      }

      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    // ------------------------------------------------------------------------
    // LOCAL JSON FALLBACK MODE (Before Supabase keys are added)
    // ------------------------------------------------------------------------
    const db = readLocalDb();

    if (action === 'login') {
      const { email, password } = body;
      const admin = db.admins.find(
        (a) =>
          a.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
          a.password === password
      );
      if (!admin) {
        return NextResponse.json(
          { error: 'Invalid admin email or password. Please verify your credentials.' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    if (action === 'signup') {
      const { fullName, email, password, role, securityPin } = body;
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password || !fullName) {
        return NextResponse.json(
          { error: 'Full name, email, and password are required.' },
          { status: 400 }
        );
      }
      const existing = db.admins.find((a) => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json(
          { error: 'An admin account with this email already exists.' },
          { status: 409 }
        );
      }
      const newAdmin: AdminUserAccount = {
        id: `adm-${Date.now()}`,
        fullName: String(fullName).trim(),
        email: cleanEmail,
        password: String(password),
        role: String(role || 'Organizing Committee Admin'),
        securityPin: String(securityPin || '2026'),
      };
      db.admins.push(newAdmin);
      writeLocalDb(db);
      return NextResponse.json({
        admin: {
          id: newAdmin.id,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    }

    if (action === 'add_registration') {
      const { registration } = body as { registration: StudentRegistrationRecord };
      if (!registration || !registration.delegateId) {
        return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 });
      }
      if (!registration.paymentReceiptUrl || !registration.paymentTransactionId?.trim()) {
        return NextResponse.json(
          {
            error:
              'Payment receipt screenshot and transaction ID are required to complete workshop registration.',
          },
          { status: 400 }
        );
      }
      db.registrations = [
        {
          ...registration,
          paymentVerificationStatus: registration.paymentVerificationStatus || 'Pending Review',
        },
        ...db.registrations.filter((r) => r.delegateId !== registration.delegateId),
      ];
      writeLocalDb(db);
      return NextResponse.json({ registrations: db.registrations });
    }

    if (action === 'verify_payment') {
      const { delegateId, status, verifiedBy, remarks } = body as {
        delegateId: string;
        status: PaymentVerificationStatus;
        verifiedBy?: string;
        remarks?: string;
      };
      const allowed: PaymentVerificationStatus[] = ['Pending Review', 'Verified', 'Rejected'];
      if (!delegateId || !allowed.includes(status)) {
        return NextResponse.json(
          { error: 'Valid delegateId and verification status are required.' },
          { status: 400 }
        );
      }

      const verifiedAt =
        status === 'Pending Review'
          ? undefined
          : new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

      db.registrations = db.registrations.map((r) =>
        r.delegateId === delegateId
          ? {
            ...r,
            paymentVerificationStatus: status,
            paymentVerifiedBy: status === 'Pending Review' ? undefined : verifiedBy || 'Admin',
            paymentVerifiedAt: verifiedAt,
            paymentRemarks: remarks ? String(remarks).trim() : undefined,
          }
          : r
      );
      writeLocalDb(db);
      return NextResponse.json({ registrations: db.registrations });
    }

    if (action === 'delete_registration') {
      const { delegateId } = body;
      db.registrations = db.registrations.filter((r) => r.delegateId !== delegateId);
      writeLocalDb(db);
      return NextResponse.json({ registrations: db.registrations });
    }

    if (action === 'save_posters') {
      const { posters } = body as { posters: EventPosterItem[] };
      if (Array.isArray(posters)) {
        db.posters = posters;
        writeLocalDb(db);
      }
      return NextResponse.json({ posters: db.posters });
    }

    if (action === 'save_archive_photos') {
      const { archivePhotos } = body as { archivePhotos: ArchivePhotoItem[] };
      if (Array.isArray(archivePhotos)) {
        db.archivePhotos = archivePhotos;
        writeLocalDb(db);
      }
      return NextResponse.json({ archivePhotos: db.archivePhotos });
    }

    if (action === 'save_teaser') {
      const { teaserVideoUrl, teaserVideoTitle } = body;
      const prevUrl = db.teaserVideoUrl;
      const nextUrl = teaserVideoUrl ? String(teaserVideoUrl).trim() : null;
      db.teaserVideoUrl = nextUrl;
      if (teaserVideoTitle) {
        db.teaserVideoTitle = String(teaserVideoTitle).trim();
      }
      writeLocalDb(db);

      // Clean up old locally uploaded trailer video file if removed or replaced
      let storageDeleted = false;
      if (prevUrl && prevUrl !== nextUrl && prevUrl.startsWith('/uploads/videos/')) {
        const diskFile = path.join(process.cwd(), 'public', prevUrl);
        try {
          if (fs.existsSync(diskFile)) {
            fs.unlinkSync(diskFile);
            storageDeleted = true;
          }
        } catch (err) {
          console.warn('Could not delete old local trailer file:', err);
        }
      }

      return NextResponse.json({
        teaserVideoUrl: db.teaserVideoUrl,
        teaserVideoTitle: db.teaserVideoTitle,
        storageDeleted,
      });
    }

    if (action === 'save_payment_qr') {
      const { paymentQrUrl, paymentUpiId, paymentAccountName } = body;
      db.paymentQrUrl = paymentQrUrl ? String(paymentQrUrl).trim() : null;
      if (paymentUpiId && String(paymentUpiId).trim()) {
        db.paymentUpiId = String(paymentUpiId).trim();
      }
      if (paymentAccountName && String(paymentAccountName).trim()) {
        db.paymentAccountName = String(paymentAccountName).trim();
      }
      writeLocalDb(db);
      return NextResponse.json({
        paymentQrUrl: db.paymentQrUrl,
        paymentUpiId: db.paymentUpiId,
        paymentAccountName: db.paymentAccountName,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
