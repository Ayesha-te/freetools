"use client";

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Download } from "lucide-react";
import { Button, NumberField, Panel, Select, Stat, Toolbar, ResetButton, num } from "@/components/ui";
import { canvasToBlob, downloadBlob, drawToCanvas, extFor, formatBytes, safeFilename, type OutFormat } from "@/lib/image";
import { track } from "@/lib/analytics";
import { ErrorBox, FileBadge, ImagePicker, Preview, useBlobUrl, useSingleImage } from "./shared";
import type { ToolProps } from "../ToolRenderer";

type Rect = { x: number; y: number; w: number; h: number };
const RATIOS: { label: string; v: number | null }[] = [
  { label: "Free", v: null },
  { label: "1:1 Square", v: 1 },
  { label: "4:3", v: 4 / 3 },
  { label: "3:2", v: 3 / 2 },
  { label: "16:9", v: 16 / 9 },
  { label: "9:16 Story", v: 9 / 16 },
  { label: "4:5 Portrait", v: 4 / 5 },
  { label: "35:45 Passport-style", v: 35 / 45 },
];

function clampRect(r: Rect, W: number, H: number): Rect {
  const w = Math.min(Math.max(1, r.w), W);
  const h = Math.min(Math.max(1, r.h), H);
  return { x: Math.min(Math.max(0, r.x), W - w), y: Math.min(Math.max(0, r.y), H - h), w, h };
}
function centered(W: number, H: number, ratio: number | null): Rect {
  if (!ratio) return { x: Math.round(W * 0.1), y: Math.round(H * 0.1), w: Math.round(W * 0.8), h: Math.round(H * 0.8) };
  let w = W * 0.9, h = w / ratio;
  if (h > H * 0.9) { h = H * 0.9; w = h * ratio; }
  return { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w: Math.round(w), h: Math.round(h) };
}

export default function ImageCropper({ slug }: ToolProps) {
  const { image, error, setError, pick, reset } = useSingleImage();
  const [ratioIdx, setRatioIdx] = useState(0);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [result, setResult] = useState<Blob | null>(null);
  const url = useBlobUrl(result);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: "move" | "se" | "nw" | "ne" | "sw"; sx: number; sy: number; start: Rect; scale: number } | null>(null);
  const ratio = RATIOS[ratioIdx].v;

  useEffect(() => {
    if (image) setRect(centered(image.width, image.height, ratio));
  }, [image, ratio]);

  function begin(e: RPointerEvent, mode: "move" | "se" | "nw" | "ne" | "sw") {
    if (!image || !box.current) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const scale = image.width / box.current.getBoundingClientRect().width;
    drag.current = { mode, sx: e.clientX, sy: e.clientY, start: rect, scale };
  }
  function moveP(e: RPointerEvent) {
    const d = drag.current;
    if (!d || !image) return;
    const dx = (e.clientX - d.sx) * d.scale;
    const dy = (e.clientY - d.sy) * d.scale;
    const s = d.start;
    let r: Rect;
    if (d.mode === "move") r = { ...s, x: s.x + dx, y: s.y + dy };
    else {
      let x1 = s.x, y1 = s.y, x2 = s.x + s.w, y2 = s.y + s.h;
      if (d.mode.includes("e")) x2 += dx; else x1 += dx;
      if (d.mode.includes("s")) y2 += dy; else y1 += dy;
      x1 = Math.max(0, x1); y1 = Math.max(0, y1); x2 = Math.min(image.width, x2); y2 = Math.min(image.height, y2);
      let w = Math.max(10, x2 - x1), h = Math.max(10, y2 - y1);
      if (ratio) {
        h = w / ratio;
        if (d.mode.includes("n")) y1 = s.y + s.h - h;
        if (y1 < 0 || y1 + h > image.height) { h = d.mode.includes("n") ? s.y + s.h : image.height - y1; w = h * ratio; if (d.mode.includes("n")) y1 = s.y + s.h - h; }
        if (d.mode.includes("w")) x1 = s.x + s.w - w;
      }
      r = { x: x1, y: y1, w, h };
    }
    setRect(clampRect({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.w), h: Math.round(r.h) }, image.width, image.height));
  }
  function end() {
    drag.current = null;
  }

  function setField(k: keyof Rect, v: string) {
    if (!image) return;
    const n = Math.round(num(v));
    if (!Number.isFinite(n)) return;
    const next = { ...rect, [k]: n };
    if (ratio && k === "w") next.h = Math.round(n / ratio);
    if (ratio && k === "h") next.w = Math.round(n * ratio);
    setRect(clampRect(next, image.width, image.height));
  }

  async function crop() {
    if (!image) return;
    setError("");
    try {
      track("tool_start", { tool: slug });
      const type: OutFormat = image.file.type === "image/png" ? "image/png" : image.file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const c = drawToCanvas(image.img, rect.w, rect.h, { sx: rect.x, sy: rect.y, sw: rect.w, sh: rect.h, background: type === "image/jpeg" ? "#fff" : undefined });
      setResult(await canvasToBlob(c, type, type === "image/png" ? undefined : 0.92));
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const handle = "absolute h-4 w-4 rounded-sm border-2 border-white bg-primary touch-none";

  return (
    <div className="space-y-4">
      <Panel>
        {!image ? <ImagePicker onFiles={(f) => { setResult(null); pick(f); }} /> : <FileBadge image={image} onClear={() => { reset(); setResult(null); }} />}
        {image && (
          <div className="mt-5 space-y-4">
            <div className="flex justify-center rounded-lg bg-surface-2 p-2">
              <div ref={box} className="relative inline-block max-w-full select-none touch-none" onPointerMove={moveP} onPointerUp={end} onPointerCancel={end}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="Image being cropped" className="block max-h-[60vh] max-w-full" draggable={false} />
                <div
                  className="absolute cursor-move border-2 border-white outline outline-1 outline-primary"
                  style={{ left: pct(rect.x, image.width), top: pct(rect.y, image.height), width: pct(rect.w, image.width), height: pct(rect.h, image.height), boxShadow: "0 0 0 9999px rgba(15,23,42,0.55)" }}
                  onPointerDown={(e) => begin(e, "move")}
                  role="presentation"
                >
                  <span className={`${handle} -left-2 -top-2 cursor-nwse-resize`} onPointerDown={(e) => begin(e, "nw")} />
                  <span className={`${handle} -right-2 -top-2 cursor-nesw-resize`} onPointerDown={(e) => begin(e, "ne")} />
                  <span className={`${handle} -bottom-2 -left-2 cursor-nesw-resize`} onPointerDown={(e) => begin(e, "sw")} />
                  <span className={`${handle} -bottom-2 -right-2 cursor-nwse-resize`} onPointerDown={(e) => begin(e, "se")} />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted">Drag the box to move it, drag a corner to resize, or type exact pixel values below.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Select label="Aspect ratio" value={ratioIdx} onChange={(e) => setRatioIdx(Number(e.target.value))} className="col-span-2 sm:col-span-1">
                {RATIOS.map((r, i) => (
                  <option key={r.label} value={i}>
                    {r.label}
                  </option>
                ))}
              </Select>
              <NumberField label="X" value={String(rect.x)} onChange={(v) => setField("x", v)} suffix="px" min={0} />
              <NumberField label="Y" value={String(rect.y)} onChange={(v) => setField("y", v)} suffix="px" min={0} />
              <NumberField label="Width" value={String(rect.w)} onChange={(v) => setField("w", v)} suffix="px" min={1} />
              <NumberField label="Height" value={String(rect.h)} onChange={(v) => setField("h", v)} suffix="px" min={1} />
            </div>
            <Toolbar>
              <Button onClick={crop}>Crop image</Button>
              <ResetButton onClick={() => { setRect(centered(image.width, image.height, ratio)); setResult(null); }} />
            </Toolbar>
          </div>
        )}
        <div className="mt-4">
          <ErrorBox error={error} />
        </div>
      </Panel>
      {image && result && url && (
        <Panel title="Cropped image">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Size" value={`${rect.w}×${rect.h}px`} highlight />
              <Stat label="File size" value={formatBytes(result.size)} />
            </div>
            <Preview src={url} label="Cropped result" />
            <Button onClick={() => { downloadBlob(result, safeFilename(image.file.name, extFor(result.type), "-cropped")); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download cropped image
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
