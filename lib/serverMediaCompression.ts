import sharp from 'sharp';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { MediaBucket } from '@/lib/supabaseServer';

const execFileAsync = promisify(execFile);

export interface ServerCompressionResult {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  originalBytes: number;
  compressedBytes: number;
  savedPercent: number;
  method: string;
}

interface ServerImageProfile {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  fallbackQuality: number;
  targetMaxBytes: number;
}

const SERVER_IMAGE_PROFILES: Record<Exclude<MediaBucket, 'videos'>, ServerImageProfile> = {
  // Payment receipt screenshots: readable UTR & UPI details at ultra-low storage cost (~40–110 KB)
  receipts: {
    maxWidth: 1080,
    maxHeight: 1440,
    quality: 66,
    fallbackQuality: 52,
    targetMaxBytes: 135 * 1024,
  },
  // Official posters: crisp 3:4 artwork (~100–280 KB)
  posters: {
    maxWidth: 1400,
    maxHeight: 1860,
    quality: 76,
    fallbackQuality: 62,
    targetMaxBytes: 340 * 1024,
  },
  // Archive gallery photos (~90–240 KB)
  archive: {
    maxWidth: 1400,
    maxHeight: 1400,
    quality: 72,
    fallbackQuality: 58,
    targetMaxBytes: 260 * 1024,
  },
  // Official UPI Payment QR: razor-sharp modules for instant mobile scanning (~15–50 KB)
  'payment-qr': {
    maxWidth: 720,
    maxHeight: 720,
    quality: 84,
    fallbackQuality: 76,
    targetMaxBytes: 85 * 1024,
  },
};

function swapExtension(fileName: string, ext: string): string {
  const cleanBase = fileName.replace(/\.[^/.]+$/, '') || 'media';
  return `${cleanBase}.${ext}`;
}

async function compressImageWithSharp(
  inputBuffer: Buffer,
  fileName: string,
  mimeType: string,
  bucket: Exclude<MediaBucket, 'videos'>
): Promise<ServerCompressionResult> {
  const profile = SERVER_IMAGE_PROFILES[bucket];
  const originalBytes = inputBuffer.length;

  try {
    // Auto-orient via EXIF then strip all metadata (GPS, EXIF, ICC) for minimal footprint
    let outputBuffer = await sharp(inputBuffer, { failOn: 'none' })
      .rotate()
      .resize({
        width: profile.maxWidth,
        height: profile.maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: profile.quality,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    // Second pass if still above bucket target size
    if (outputBuffer.length > profile.targetMaxBytes) {
      const tighter = await sharp(inputBuffer, { failOn: 'none' })
        .rotate()
        .resize({
          width: profile.maxWidth,
          height: profile.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: profile.fallbackQuality,
          effort: 6,
          smartSubsample: true,
        })
        .toBuffer();

      if (tighter.length < outputBuffer.length) {
        outputBuffer = tighter;
      }
    }

    // Extra pass for oversized payment receipts so hundreds of student uploads barely touch Supabase quota
    if (bucket === 'receipts' && outputBuffer.length > 180 * 1024) {
      const compactReceipt = await sharp(inputBuffer, { failOn: 'none' })
        .rotate()
        .resize({
          width: 900,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 48,
          effort: 6,
          smartSubsample: true,
        })
        .toBuffer();

      if (compactReceipt.length < outputBuffer.length) {
        outputBuffer = compactReceipt;
      }
    }

    // If incoming file was already a smaller WebP (from client pre-compression), keep the smaller one
    if (mimeType === 'image/webp' && originalBytes <= outputBuffer.length) {
      return {
        buffer: inputBuffer,
        fileName: swapExtension(fileName, 'webp'),
        mimeType: 'image/webp',
        originalBytes,
        compressedBytes: originalBytes,
        savedPercent: 0,
        method: 'webp-already-optimal',
      };
    }

    const savedPercent =
      originalBytes > 0
        ? Math.max(0, Math.round(((originalBytes - outputBuffer.length) / originalBytes) * 100))
        : 0;

    return {
      buffer: outputBuffer,
      fileName: swapExtension(fileName, 'webp'),
      mimeType: 'image/webp',
      originalBytes,
      compressedBytes: outputBuffer.length,
      savedPercent,
      method: 'sharp-webp',
    };
  } catch (err) {
    console.warn('Server sharp compression failed, keeping original image buffer:', err);
    return {
      buffer: inputBuffer,
      fileName,
      mimeType,
      originalBytes,
      compressedBytes: originalBytes,
      savedPercent: 0,
      method: 'passthrough',
    };
  }
}

async function compressVideoWithFfmpeg(
  inputBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ServerCompressionResult> {
  const originalBytes = inputBuffer.length;
  const tempId = `numescon-vid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const inputExt = path.extname(fileName).toLowerCase() || '.mp4';
  const inputPath = path.join(os.tmpdir(), `${tempId}-in${inputExt}`);
  const outputPath = path.join(os.tmpdir(), `${tempId}-out.mp4`);

  try {
    await fs.promises.writeFile(inputPath, inputBuffer);

    // Transcode to compact 720p max, 30fps max, H.264 (CRF 28, maxrate 1100k) + AAC 96k + faststart
    // Typically achieves 70–90% file size reduction on phone/camera/editor videos while looking crisp on web
    const args = [
      '-y',
      '-i',
      inputPath,
      '-vf',
      "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      '-r',
      '30',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '28',
      '-maxrate',
      '1100k',
      '-bufsize',
      '2200k',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      '-ac',
      '2',
      '-movflags',
      '+faststart',
      outputPath,
    ];

    await execFileAsync('ffmpeg', args, {
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const compressedBuffer = await fs.promises.readFile(outputPath);
    const isAlreadyMp4 = mimeType === 'video/mp4';

    // Always prefer MP4 for non-MP4 inputs (e.g. .mov); for MP4 inputs, keep whichever is smaller
    if (compressedBuffer.length > 0 && (!isAlreadyMp4 || compressedBuffer.length < originalBytes)) {
      const savedPercent =
        originalBytes > 0
          ? Math.max(0, Math.round(((originalBytes - compressedBuffer.length) / originalBytes) * 100))
          : 0;

      return {
        buffer: compressedBuffer,
        fileName: swapExtension(fileName, 'mp4'),
        mimeType: 'video/mp4',
        originalBytes,
        compressedBytes: compressedBuffer.length,
        savedPercent,
        method: 'ffmpeg-h264-720p',
      };
    }

    return {
      buffer: inputBuffer,
      fileName,
      mimeType,
      originalBytes,
      compressedBytes: originalBytes,
      savedPercent: 0,
      method: 'video-already-optimal',
    };
  } catch (err) {
    console.warn('Server FFmpeg video compression unavailable or failed, using original video:', err);
    return {
      buffer: inputBuffer,
      fileName,
      mimeType,
      originalBytes,
      compressedBytes: originalBytes,
      savedPercent: 0,
      method: 'passthrough',
    };
  } finally {
    await Promise.allSettled([
      fs.promises.unlink(inputPath).catch(() => undefined),
      fs.promises.unlink(outputPath).catch(() => undefined),
    ]);
  }
}

export async function compressMediaOnServer(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  bucket: MediaBucket
): Promise<ServerCompressionResult> {
  if (bucket === 'videos') {
    return compressVideoWithFfmpeg(buffer, fileName, mimeType);
  }
  return compressImageWithSharp(buffer, fileName, mimeType, bucket);
}
