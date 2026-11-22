export const MAX_IMAGE_BYTES = 40 * 1024 * 1024; // 40 MB
export const MAX_PIXELS = 50_000_000; // ~50 MP guards against memory exhaustion
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];

export type OutFormat = "image/jpeg" | "image/png" | "image/webp";

export function validateImageFile(f: File, allowed: string[] = IMAGE_TYPES): string | null {
  if (!allowed.includes(f.type)) {
    const names = allowed.map((t) => t.split("/")[1].toUpperCase().replace("JPEG", "JPG")).join(", ");
    return `"${f.name}" is not a supported image. Supported formats: ${names}.`;
  }
  if (f.size > MAX_IMAGE_BYTES) return `"${f.name}" is larger than 40 MB. Please choose a smaller image.`;
  if (f.size === 0) return `"${f.name}" is empty.`;
  return null;
}

export async function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    if (img.naturalWidth * img.naturalHeight > MAX_PIXELS) {
      throw new Error("This image has too many pixels to process safely in the browser (limit about 50 megapixels).");
    }
    return img;
  } catch (e) {
    if (e instanceof Error && e.message.includes("megapixels")) throw e;
    throw new Error("The file could not be read as an image. It may be corrupted or in an unsupported format.");
  } finally {
    // image is decoded; URL no longer needed
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export function drawToCanvas(
  img: CanvasImageSource & { naturalWidth?: number; naturalHeight?: number; width: number; height: number },
  width: number,
  height: number,
  opts: { background?: string; sx?: number; sy?: number; sw?: number; sh?: number } = {},
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");
  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  ctx.drawImage(img, opts.sx ?? 0, opts.sy ?? 0, opts.sw ?? nw, opts.sh ?? nh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: OutFormat, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The browser failed to encode the image."))), type, quality),
  );
}

export function extFor(type: string) {
  return type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
}

export interface TargetResult {
  blob: Blob;
  quality: number;
  scale: number;
  hitTarget: boolean;
  attempts: number;
}

/**
 * Find the highest quality (and largest scale) whose encoded size is <= target.
 * Binary-search quality at each scale; if even the minimum quality is too big,
 * reduce dimensions by ~15% and try again. Pure w.r.t. the encode function so it can be unit tested.
 */
export async function compressToTarget(
  encode: (quality: number, scale: number) => Promise<Blob>,
  targetBytes: number,
  opts: { minQuality?: number; maxQuality?: number; minScale?: number; maxAttempts?: number } = {},
): Promise<TargetResult> {
  const minQ = opts.minQuality ?? 0.3;
  const maxQ = opts.maxQuality ?? 0.95;
  const minScale = opts.minScale ?? 0.1;
  const maxAttempts = opts.maxAttempts ?? 60;
  let attempts = 0;
  let scale = 1;
  let smallest: TargetResult | null = null;

  while (scale >= minScale && attempts < maxAttempts) {
    let lo = minQ, hi = maxQ;
    let best: Blob | null = null;
    let bestQ = 0;
    // check the top first: if max quality already fits, we are done
    const top = await encode(maxQ, scale);
    attempts++;
    if (!smallest || top.size < smallest.blob.size) smallest = { blob: top, quality: maxQ, scale, hitTarget: top.size <= targetBytes, attempts };
    if (top.size <= targetBytes) return { blob: top, quality: maxQ, scale, hitTarget: true, attempts };
    for (let i = 0; i < 7 && attempts < maxAttempts; i++) {
      const q = (lo + hi) / 2;
      const b = await encode(q, scale);
      attempts++;
      if (!smallest || b.size < smallest.blob.size) smallest = { blob: b, quality: q, scale, hitTarget: b.size <= targetBytes, attempts };
      if (b.size <= targetBytes) { best = b; bestQ = q; lo = q; } else hi = q;
    }
    if (!best) {
      const low = await encode(minQ, scale);
      attempts++;
      if (!smallest || low.size < smallest.blob.size) smallest = { blob: low, quality: minQ, scale, hitTarget: low.size <= targetBytes, attempts };
      if (low.size <= targetBytes) { best = low; bestQ = minQ; }
    }
    if (best) return { blob: best, quality: bestQ, scale, hitTarget: true, attempts };
    scale = Math.round(scale * 0.85 * 1000) / 1000;
  }
  return { ...(smallest as TargetResult), hitTarget: false, attempts };
}

export function safeFilename(name: string, newExt?: string, suffix = "") {
  const dot = name.lastIndexOf(".");
  let base = dot > 0 ? name.slice(0, dot) : name;
  base = base.replace(/[^\p{L}\p{N}._ -]+/gu, "_").replace(/\s+/g, "-").replace(/^[.\-_]+/, "").slice(0, 80) || "file";
  const ext = newExt ?? (dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "");
  return `${base}${suffix}${ext ? "." + ext : ""}`;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
