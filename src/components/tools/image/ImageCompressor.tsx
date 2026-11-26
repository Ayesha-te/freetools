"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Alert, Button, NumberField, Panel, Select, Stat, Toolbar, ResetButton, num } from "@/components/ui";
import { canvasToBlob, compressToTarget, downloadBlob, drawToCanvas, extFor, formatBytes, safeFilename, type OutFormat } from "@/lib/image";
import { track } from "@/lib/analytics";
import { ErrorBox, FileBadge, ImagePicker, Preview, useBlobUrl, useSingleImage } from "./shared";
import type { ToolProps } from "../ToolRenderer";

interface Result {
  blob: Blob;
  width: number;
  height: number;
  quality?: number;
  hitTarget?: boolean;
}

export default function ImageCompressor({ slug }: ToolProps) {
  const targetMode = slug !== "image-compressor";
  // compress-image-to-20kb -> "20", compress-image-to-200kb -> "200", etc.
  const defaultTarget = /^compress-image-to-(\d+)kb$/.exec(slug)?.[1] ?? "100";
  const { image, error, setError, pick, reset, loading } = useSingleImage();
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<"auto" | OutFormat>("auto");
  const [maxDim, setMaxDim] = useState("");
  const [targetKb, setTargetKb] = useState(defaultTarget);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const resultUrl = useBlobUrl(result?.blob ?? null);

  function outType(): OutFormat {
    if (format !== "auto") return format;
    if (!image) return "image/jpeg";
    if (targetMode) return image.file.type === "image/webp" ? "image/webp" : "image/jpeg";
    return image.file.type === "image/png" || image.file.type === "image/webp" ? (image.file.type as OutFormat) : "image/jpeg";
  }

  async function run() {
    if (!image) return;
    setError("");
    setResult(null);
    setBusy(true);
    track("tool_start", { tool: slug });
    try {
      const type = outType();
      const bg = type === "image/jpeg" ? "#ffffff" : undefined;
      let w = image.width, h = image.height;
      const md = num(maxDim);
      if (Number.isFinite(md)) {
        if (md < 16 || md > 20000) throw new Error("Maximum dimension must be between 16 and 20,000 pixels.");
        const s = Math.min(1, md / Math.max(w, h));
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      if (targetMode) {
        const kb = num(targetKb);
        if (!Number.isFinite(kb) || kb < 5 || kb > 20000) throw new Error("Enter a target size between 5 KB and 20,000 KB.");
        const target = Math.floor(kb * 1024);
        const cache = new Map<number, HTMLCanvasElement>();
        const encode = async (q: number, scale: number) => {
          let c = cache.get(scale);
          if (!c) {
            c = drawToCanvas(image.img, Math.max(1, w * scale), Math.max(1, h * scale), { background: bg });
            cache.clear();
            cache.set(scale, c);
          }
          return canvasToBlob(c, type, type === "image/png" ? undefined : q);
        };
        const r = await compressToTarget(encode, target, { maxQuality: 0.92 });
        cache.clear();
        setResult({ blob: r.blob, width: Math.max(1, Math.round(w * r.scale)), height: Math.max(1, Math.round(h * r.scale)), quality: r.quality, hitTarget: r.hitTarget });
      } else {
        const c = drawToCanvas(image.img, w, h, { background: bg });
        const blob = await canvasToBlob(c, type, type === "image/png" ? undefined : quality / 100);
        setResult({ blob, width: c.width, height: c.height, quality: quality / 100 });
      }
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message || "Compression failed.");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    reset();
    setResult(null);
  }

  const saved = image && result ? 1 - result.blob.size / image.file.size : 0;
  const type = outType();

  return (
    <div className="space-y-4">
      <Panel>
        {!image ? (
          <ImagePicker onFiles={(f) => { setResult(null); pick(f); }} />
        ) : (
          <FileBadge image={image} onClear={clear} />
        )}
        {loading && <p className="mt-3 text-sm text-muted">Reading image…</p>}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {targetMode ? (
            <NumberField label="Target size" value={targetKb} onChange={setTargetKb} suffix="KB" min={5} hint="The result will be at or below this size if possible." />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="q" className="text-sm font-medium text-ink">
                Quality: {quality}%
              </label>
              <input id="q" type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="h-10 accent-[var(--primary)]" disabled={type === "image/png"} />
              <p className="text-xs text-muted">{type === "image/png" ? "PNG is lossless; quality does not apply. Use max dimension or WebP/JPG." : "Lower = smaller file, more artefacts."}</p>
            </div>
          )}
          <Select label="Output format" value={format} onChange={(e) => setFormat(e.target.value as typeof format)} hint={type === "image/jpeg" ? "Transparent areas become white in JPG." : undefined}>
            <option value="auto">Automatic ({extFor(type).toUpperCase()})</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
            {!targetMode && <option value="image/png">PNG</option>}
          </Select>
          <NumberField label="Max width/height (optional)" value={maxDim} onChange={setMaxDim} suffix="px" placeholder="Keep original" min={16} />
        </div>

        <div className="mt-5">
          <Toolbar>
            <Button onClick={run} disabled={!image || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {busy ? "Compressing…" : "Compress image"}
            </Button>
            {image && <ResetButton onClick={clear} />}
          </Toolbar>
        </div>
        <div className="mt-4">
          <ErrorBox error={error} />
        </div>
      </Panel>

      {image && result && (
        <Panel title="Result">
          <div aria-live="polite" className="space-y-4">
            {targetMode && (
              result.hitTarget ? (
                <Alert kind="success">
                  Done: {formatBytes(result.blob.size)}, which is within your {targetKb} KB target
                  {result.width !== image.width && ` (dimensions reduced to ${result.width}×${result.height}px to fit)`}.
                </Alert>
              ) : (
                <Alert kind="warn" title="Target not reached">
                  The smallest version we could produce is {formatBytes(result.blob.size)}, which is above {targetKb} KB. Try setting a smaller maximum width/height, or choose WebP.
                </Alert>
              )
            )}
            {!targetMode && saved <= 0 && (
              <Alert kind="warn">The re-encoded image is not smaller than the original ({formatBytes(result.blob.size)}). The original is already well compressed — try a lower quality, WebP, or a smaller max dimension.</Alert>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Original" value={formatBytes(image.file.size)} sub={`${image.width}×${image.height}px`} />
              <Stat label="Compressed" value={formatBytes(result.blob.size)} sub={`${result.width}×${result.height}px · ${extFor(result.blob.type).toUpperCase()}`} highlight />
              <Stat label="Reduction" value={saved > 0 ? `${(saved * 100).toFixed(1)}%` : "None"} sub={result.quality ? `Quality used: ${Math.round(result.quality * 100)}%` : undefined} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Preview src={image.url} label="Before" caption={formatBytes(image.file.size)} />
              {resultUrl && <Preview src={resultUrl} label="After" caption={formatBytes(result.blob.size)} />}
            </div>
            <Button
              onClick={() => {
                downloadBlob(result.blob, safeFilename(image.file.name, extFor(result.blob.type), "-compressed"));
                track("tool_download", { tool: slug });
              }}
            >
              <Download className="h-4 w-4" aria-hidden /> Download compressed image
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
