import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export type MediaBucket = 'posters' | 'videos' | 'payment-qr' | 'receipts' | 'archive';

let cachedSupabaseAdmin: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      serviceKey &&
      url.startsWith('https://') &&
      !url.includes('YOUR_PROJECT_REF') &&
      !serviceKey.includes('YOUR_SUPABASE_')
  );
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cachedSupabaseAdmin) return cachedSupabaseAdmin;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  cachedSupabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedSupabaseAdmin;
}

export function createSupabaseAuthClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_')
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function hashAdminPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(`numescon_2026_nbmch::${password}`)
    .digest('hex');
}

export async function uploadBufferToSupabaseStorage(
  bucket: MediaBucket,
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ publicUrl: string; path: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase Storage is not configured.');
  }

  const safeBase = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBase || 'upload'}`;

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return {
    publicUrl: data.publicUrl,
    path: objectPath,
  };
}

export async function deleteMediaFromSupabaseByUrl(
  publicUrl: string | null | undefined,
  bucket: MediaBucket
): Promise<boolean> {
  if (!publicUrl) return false;
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return false;

  const rawObjectPath = publicUrl.slice(idx + marker.length).split('?')[0];
  const objectPath = decodeURIComponent(rawObjectPath);
  if (!objectPath) return false;

  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
  if (error) {
    console.warn(`Failed to delete ${bucket}/${objectPath} from Supabase Storage:`, error.message);
    return false;
  }
  return true;
}
