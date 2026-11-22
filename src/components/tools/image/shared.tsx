"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FileDrop from "@/components/ui/FileDrop";
import { Alert } from "@/components/ui";
import { formatBytes, loadImage, validateImageFile, IMAGE_TYPES } from "@/lib/image";

export interface LoadedImage {
  file: File;
  img: HTMLImageElement;
  url: string;
  width: number;
  height: number;
}

/** Single-image picker with validation, decoding and preview URL management. */
export function useSingleImage(allowed: string[] = IMAGE_TYPES) {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => { if (image) URL.revokeObjectURL(image.url); }, [image]);

  async function pick(files: File[]) {
    setError("");
    const f = files[0];
    if (!f) return;
    const v = validateImageFile(f, allowed);
    if (v) return setError(v);
    setLoading(true);
    try {
      const img = await loadImage(f);
      setImage({ file: f, img, url: URL.createObjectURL(f), width: img.naturalWidth, height: img.naturalHeight });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return { image, error, setError, loading, pick, reset: () => { setImage(null); setError(""); } };
}

export function ImagePicker({ onFiles, accept = "image/jpeg,image/png,image/webp,image/gif,image/bmp", hint, multiple = false }: { onFiles: (f: File[]) => void; accept?: string; hint?: string; multiple?: boolean }) {
  return <FileDrop accept={accept} multiple={multiple} onFiles={onFiles} label={multiple ? "choose images" : "choose an image"} hint={hint ?? "JPG, PNG, WebP, GIF or BMP · up to 40 MB · processed on your device"} />;
}

export function FileBadge({ image, onClear }: { image: LoadedImage; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
      <span className="min-w-0 truncate text-ink">
        <strong className="font-medium">{image.file.name}</strong>
        <span className="text-muted"> · {image.width}×{image.height}px · {formatBytes(image.file.size)}</span>
      </span>
      <button type="button" onClick={onClear} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-danger" aria-label="Remove image">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function Preview({ src, label, caption }: { src: string; label: string; caption?: string }) {
  return (
    <figure className="min-w-0">
      <div className="checkerboard flex h-56 items-center justify-center overflow-hidden rounded-lg border border-border sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
      </div>
      <figcaption className="mt-2 text-sm text-ink-2">
        <span className="font-medium text-ink">{label}</span>
        {caption && <span className="text-muted"> · {caption}</span>}
      </figcaption>
    </figure>
  );
}

export function ErrorBox({ error }: { error: string }) {
  return error ? <Alert kind="error">{error}</Alert> : null;
}

/** Track an object URL for a produced blob and revoke it when replaced/unmounted. */
export function useBlobUrl(blob: Blob | null) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) { setUrl(""); return; }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}
