'use client';

export type ImageMediaBucket = 'posters' | 'archive' | 'payment-qr' | 'receipts';

interface ImageCompressionProfile {
  maxDimension: number;
  initialQuality: number;
  minQuality: number;
  targetMaxBytes: number;
}

const IMAGE_PROFILES: Record<ImageMediaBucket, ImageCompressionProfile> = {
  // Student payment receipts: crisp UTR/UPI text legibility while staying tiny (~45–130 KB)
  receipts: {
    maxDimension: 1080,
    initialQuality: 0.72,
    minQuality: 0.46,
    targetMaxBytes: 140 * 1024,
  },
  // Event posters: sharp 3:4 display on mobile & desktop (~120–300 KB)
  posters: {
    maxDimension: 1400,
    initialQuality: 0.8,
    minQuality: 0.58,
    targetMaxBytes: 320 * 1024,
  },
  // Legacy archive gallery photos (~100–250 KB)
  archive: {
    maxDimension: 1400,
    initialQuality: 0.76,
    minQuality: 0.56,
    targetMaxBytes: 260 * 1024,
  },
  // Official UPI Payment QR: ultra-sharp module edges for reliable scanning (~15–60 KB)
  'payment-qr': {
    maxDimension: 720,
    initialQuality: 0.88,
    minQuality: 0.78,
    targetMaxBytes: 90 * 1024,
  },
};

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Selected file is not a valid image.'));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function replaceExtension(fileName: string, newExt: string): string {
  const base = fileName.replace(/\.[^/.]+$/, '') || 'media';
  return `${base}.${newExt}`;
}

export interface BrowserCompressionResult {
  file: File;
  originalBytes: number;
  compressedBytes: number;
  savedPercent: number;
}

/**
 * Compresses an image file directly in the browser to WebP (with JPEG fallback)
 * using adaptive quality stepping so uploads are fast and preserve Supabase Free Tier storage.
 */
export async function compressImageInBrowser(
  file: File,
  bucket: ImageMediaBucket
): Promise<BrowserCompressionResult> {
  const originalBytes = file.size;
  const profile = IMAGE_PROFILES[bucket];

  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalBytes,
      compressedBytes: file.size,
      savedPercent: 0,
    };
  }

  try {
    const img = await loadImageElement(file);
    const srcWidth = img.naturalWidth || img.width;
    const srcHeight = img.naturalHeight || img.height;

    if (!srcWidth || !srcHeight) {
      return { file, originalBytes, compressedBytes: file.size, savedPercent: 0 };
    }

    const longestEdge = Math.max(srcWidth, srcHeight);
    const scale = longestEdge > profile.maxDimension ? profile.maxDimension / longestEdge : 1;
    const targetWidth = Math.max(1, Math.round(srcWidth * scale));
    const targetHeight = Math.max(1, Math.round(srcHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, originalBytes, compressedBytes: file.size, savedPercent: 0 };
    }

    // Fill white background for receipts & QR codes so transparent PNGs remain crisp
    if (bucket === 'payment-qr' || bucket === 'receipts') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Prefer WebP; fall back to JPEG if browser lacks WebP encoder
    let mimeType = 'image/webp';
    let ext = 'webp';
    let quality = profile.initialQuality;
    let blob = await canvasToBlob(canvas, mimeType, quality);

    if (!blob || blob.type !== 'image/webp') {
      mimeType = 'image/jpeg';
      ext = 'jpg';
      blob = await canvasToBlob(canvas, mimeType, quality);
    }

    // Step down quality progressively if still larger than targetMaxBytes
    while (blob && blob.size > profile.targetMaxBytes && quality - 0.08 >= profile.minQuality) {
      quality = Number((quality - 0.08).toFixed(2));
      const nextBlob = await canvasToBlob(canvas, mimeType, quality);
      if (!nextBlob) break;
      blob = nextBlob;
    }

    if (!blob) {
      return { file, originalBytes, compressedBytes: file.size, savedPercent: 0 };
    }

    // Only keep compressed output if it is actually smaller than original or converted to webp
    if (blob.size >= originalBytes && file.type === 'image/webp') {
      return { file, originalBytes, compressedBytes: file.size, savedPercent: 0 };
    }

    const compressedFile = new File([blob], replaceExtension(file.name, ext), {
      type: mimeType,
      lastModified: Date.now(),
    });

    const savedPercent =
      originalBytes > 0
        ? Math.max(0, Math.round(((originalBytes - compressedFile.size) / originalBytes) * 100))
        : 0;

    return {
      file: compressedFile,
      originalBytes,
      compressedBytes: compressedFile.size,
      savedPercent,
    };
  } catch (err) {
    console.warn('Browser image pre-compression skipped, falling back to server compression:', err);
    return {
      file,
      originalBytes,
      compressedBytes: file.size,
      savedPercent: 0,
    };
  }
}

/**
 * Fallback helper that compresses an image file into a compact data URL
 * when network upload fails and local preview storage is used.
 */
export async function compressImageToDataUrl(
  file: File,
  bucket: ImageMediaBucket
): Promise<string> {
  const { file: compressed } = await compressImageInBrowser(file, bucket);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read compressed image.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(compressed);
  });
}
