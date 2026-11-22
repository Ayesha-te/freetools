"use client";

import { useEffect, useState } from "react";
import { Download, Link2, Unlink2 } from "lucide-react";
import { Alert, Button, NumberField, Panel, Segmented, Select, Stat, Toolbar, ResetButton, num } from "@/components/ui";
import { canvasToBlob, downloadBlob, drawToCanvas, extFor, formatBytes, safeFilename, type OutFormat } from "@/lib/image";
import { track } from "@/lib/analytics";
import { ErrorBox, FileBadge, ImagePicker, Preview, useBlobUrl, useSingleImage } from "./shared";
import type { ToolProps } from "../ToolRenderer";

const PRESETS = [
  { label: "Custom", w: 0, h: 0 },
  { label: "HD 1280×720", w: 1280, h: 720 },
  { label: "Full HD 1920×1080", w: 1920, h: 1080 },
  { label: "Instagram square 1080×1080", w: 1080, h: 1080 },
  { label: "Instagram portrait 1080×1350", w: 1080, h: 1350 },
  { label: "Facebook/LinkedIn link 1200×630", w: 1200, h: 630 },
  { label: "YouTube thumbnail 1280×720", w: 1280, h: 720 },
];

export default function ImageResizer({ slug }: ToolProps) {
  const { image, error, setError, pick, reset } = useSingleImage();
  const [mode, setMode] = useState<"px" | "pct">("px");
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [pct, setPct] = useState("50");
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<"auto" | OutFormat>("auto");
  const [result, setResult] = useState<{ blob: Blob; w: number; h: number } | null>(null);
  const url = useBlobUrl(result?.blob ?? null);

  async function onPick(files: File[]) {
    setResult(null);
    await pick(files);
  }
  // initialise width/height fields whenever a new image is loaded
  useEffect(() => {
    if (!image) return;
    setW(String(image.width));
    setH(String(image.height));
  }, [image]);

  function changeW(v: string) {
    setW(v);
    const n = num(v);
    if (lock && image && Number.isFinite(n)) setH(String(Math.max(1, Math.round((n * image.height) / image.width))));
  }
  function changeH(v: string) {
    setH(v);
    const n = num(v);
    if (lock && image && Number.isFinite(n)) setW(String(Math.max(1, Math.round((n * image.width) / image.height))));
  }

  async function run() {
    if (!image) return;
    setError("");
    track("tool_start", { tool: slug });
    let tw: number, th: number;
    if (mode === "pct") {
      const p = num(pct);
      if (!Number.isFinite(p) || p <= 0 || p > 1000) return setError("Percentage must be between 1 and 1000.");
      tw = Math.max(1, Math.round((image.width * p) / 100));
      th = Math.max(1, Math.round((image.height * p) / 100));
    } else {
      tw = Math.round(num(w));
      th = Math.round(num(h));
      if (!Number.isFinite(tw) || !Number.isFinite(th) || tw < 1 || th < 1) return setError("Enter a width and height of at least 1 pixel.");
    }
    if (tw > 16000 || th > 16000 || tw * th > 100_000_000) return setError("The requested size is too large for a browser canvas. Keep each side under 16,000px.");
    try {
      const type: OutFormat = format === "auto" ? (image.file.type === "image/png" ? "image/png" : image.file.type === "image/webp" ? "image/webp" : "image/jpeg") : format;
      const c = drawToCanvas(image.img, tw, th, { background: type === "image/jpeg" ? "#ffffff" : undefined });
      const blob = await canvasToBlob(c, type, type === "image/png" ? undefined : 0.92);
      setResult({ blob, w: c.width, h: c.height });
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function clear() {
    reset();
    setResult(null);
    setW("");
    setH("");
  }

  return (
    <div className="space-y-4">
      <Panel>
        {!image ? <ImagePicker onFiles={onPick} /> : <FileBadge image={image} onClear={clear} />}
        <div className="mt-5 space-y-4">
          <Segmented label="Resize by" value={mode} onChange={setMode} options={[{ value: "px", label: "Pixels" }, { value: "pct", label: "Percentage" }]} />
          {mode === "px" ? (
            <>
              <Select
                label="Preset"
                defaultValue="0"
                onChange={(e) => {
                  const p = PRESETS[Number(e.target.value)];
                  if (p.w) {
                    setLock(false);
                    setW(String(p.w));
                    setH(String(p.h));
                  }
                }}
                hint="Presets set exact dimensions; the image is stretched if its ratio differs. Crop first for a perfect fit."
              >
                {PRESETS.map((p, i) => (
                  <option key={p.label} value={i}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <div className="flex flex-wrap items-end gap-3">
                <NumberField label="Width" value={w} onChange={changeW} suffix="px" min={1} className="w-40" />
                <button
                  type="button"
                  onClick={() => setLock((l) => !l)}
                  aria-pressed={lock}
                  aria-label={lock ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong text-ink-2 hover:bg-surface-2"
                >
                  {lock ? <Link2 className="h-4 w-4" aria-hidden /> : <Unlink2 className="h-4 w-4" aria-hidden />}
                </button>
                <NumberField label="Height" value={h} onChange={changeH} suffix="px" min={1} className="w-40" />
              </div>
              <p className="text-xs text-muted">{lock ? "Aspect ratio locked." : "Aspect ratio unlocked — the image may be stretched."}</p>
            </>
          ) : (
            <NumberField label="Scale" value={pct} onChange={setPct} suffix="%" min={1} max={1000} className="max-w-xs" hint={image ? `Result: ${Math.round((image.width * (num(pct) || 0)) / 100)}×${Math.round((image.height * (num(pct) || 0)) / 100)}px` : undefined} />
          )}
          <Select label="Output format" value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="max-w-xs">
            <option value="auto">Same as original</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </Select>
          <Toolbar>
            <Button onClick={run} disabled={!image}>
              Resize image
            </Button>
            {image && <ResetButton onClick={clear} />}
          </Toolbar>
          <ErrorBox error={error} />
        </div>
      </Panel>
      {image && result && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            {(result.w > image.width || result.h > image.height) && <Alert kind="warn">You enlarged the image. Upscaling cannot add real detail, so it may look soft.</Alert>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Original" value={`${image.width}×${image.height}px`} sub={formatBytes(image.file.size)} />
              <Stat label="Resized" value={`${result.w}×${result.h}px`} sub={formatBytes(result.blob.size)} highlight />
            </div>
            {url && <Preview src={url} label="Resized image preview" caption={`${result.w}×${result.h}px`} />}
            <Button onClick={() => { downloadBlob(result.blob, safeFilename(image.file.name, extFor(result.blob.type), `-${result.w}x${result.h}`)); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download resized image
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
