import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  isSupabaseConfigured,
  MediaBucket,
  uploadBufferToSupabaseStorage,
} from '@/lib/supabaseServer';
import { compressMediaOnServer } from '@/lib/serverMediaCompression';

export const runtime = 'nodejs';
export const maxDuration = 120;

const VALID_BUCKETS: MediaBucket[] = ['posters', 'videos', 'payment-qr', 'receipts', 'archive'];

const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const rawBucket = String(formData.get('bucket') || 'posters') as MediaBucket;
    const reportedOriginalSize = Number(formData.get('originalSize') || 0);

    if (!VALID_BUCKETS.includes(rawBucket)) {
      return NextResponse.json({ error: 'Invalid target storage bucket.' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No media file attached.' }, { status: 400 });
    }

    const isVideoBucket = rawBucket === 'videos';
    const maxBytes = isVideoBucket ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: isVideoBucket
            ? 'Video file exceeds the 100 MB limit.'
            : 'Image file exceeds the 20 MB limit.',
        },
        { status: 400 }
      );
    }

    const mime = file.type || (isVideoBucket ? 'video/mp4' : 'image/jpeg');
    if (isVideoBucket && !VIDEO_MIME_TYPES.has(mime)) {
      return NextResponse.json(
        { error: 'Unsupported video format. Please upload MP4, WebM, OGG, or MOV.' },
        { status: 400 }
      );
    }
    if (!isVideoBucket && !IMAGE_MIME_TYPES.has(mime)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Please upload PNG, JPG, or WebP.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Server-side maximum optimization (sharp WebP for images, FFmpeg 720p H.264 MP4 for videos)
    const compressed =
      rawBucket === 'posters'
        ? {
          buffer: rawBuffer,
          fileName: file.name,
          mimeType: mime,
          originalBytes: rawBuffer.length,
          compressedBytes: rawBuffer.length,
          method: 'original-uncompressed',
        }
        : await compressMediaOnServer(rawBuffer, file.name, mime, rawBucket);

    const baselineOriginalBytes =
      Number.isFinite(reportedOriginalSize) && reportedOriginalSize > compressed.originalBytes
        ? reportedOriginalSize
        : compressed.originalBytes;
    const totalSavedPercent =
      baselineOriginalBytes > 0
        ? Math.max(
          0,
          Math.round(
            ((baselineOriginalBytes - compressed.compressedBytes) / baselineOriginalBytes) * 100
          )
        )
        : 0;

    // Primary path: Upload compressed buffer directly to Supabase Storage when configured
    if (isSupabaseConfigured()) {
      const { publicUrl, path: objectPath } = await uploadBufferToSupabaseStorage(
        rawBucket,
        compressed.buffer,
        compressed.fileName,
        compressed.mimeType
      );
      return NextResponse.json({
        url: publicUrl,
        path: objectPath,
        bucket: rawBucket,
        storage: 'supabase',
        originalBytes: baselineOriginalBytes,
        compressedBytes: compressed.compressedBytes,
        savedPercent: totalSavedPercent,
        format: compressed.mimeType,
        compressionMethod: compressed.method,
      });
    }

    // Local preview fallback before Supabase credentials are added to .env.local
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', rawBucket);
    fs.mkdirSync(uploadsDir, { recursive: true });

    const safeName = compressed.fileName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    const storedFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName || 'media'}`;
    const fullDiskPath = path.join(uploadsDir, storedFileName);
    fs.writeFileSync(fullDiskPath, compressed.buffer);

    return NextResponse.json({
      url: `/uploads/${rawBucket}/${storedFileName}`,
      path: storedFileName,
      bucket: rawBucket,
      storage: 'local',
      originalBytes: baselineOriginalBytes,
      compressedBytes: compressed.compressedBytes,
      savedPercent: totalSavedPercent,
      format: compressed.mimeType,
      compressionMethod: compressed.method,
    });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to upload media file.' },
      { status: 500 }
    );
  }
}
