"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, Loader2, X } from "lucide-react";
import { Alert, Button, NumberField, Panel, Select, Stat, Toolbar, ResetButton, num } from "@/components/ui";
import { canvasToBlob, downloadBlob, drawToCanvas, formatBytes, loadImage, validateImageFile } from "@/lib/image";
import { savePdf, loadPdfLib } from "@/lib/pdf";
import { track } from "@/lib/analytics";
import FileDrop from "@/components/ui/FileDrop";
import { Progress } from "./shared";
import type { ToolProps } from "../ToolRenderer";

const SIZES: Record<string, [number, number] | null> = { fit: null, a4: [595.28, 841.89], letter: [612, 792] };
const MAX = 100;

interface Item { id: string; file: File; url: string }

export default function ImageToPdf({ slug }: ToolProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [size, setSize] = useState("a4");
  const [orient, setOrient] = useState<"auto" | "portrait" | "landscape">("auto");
  const [margin, setMargin] = useState("10");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);

  const latest = useRef<Item[]>([]);
  latest.current = items;
  useEffect(() => () => latest.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  function add(files: File[]) {
    const errs: string[] = [];
    const ok: Item[] = [];
    for (const f of files) {
      const v = validateImageFile(f);
      if (v) errs.push(v);
      else ok.push({ id: `${f.name}-${Math.random()}`, file: f, url: URL.createObjectURL(f) });
    }
    setItems((c) => [...c, ...ok].slice(0, MAX));
    setErrors(errs);
    setResult(null);
  }
  function move(i: number, d: -1 | 1) {
    setItems((c) => {
      const n = [...c];
      const j = i + d;
      if (j < 0 || j >= n.length) return c;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    setResult(null);
  }

  async function build() {
    const m = num(margin);
    if (!Number.isFinite(m) || m < 0 || m > 50) return setErrors(["Margin must be between 0 and 50 mm."]);
    const mPt = (m / 25.4) * 72;
    setBusy(true);
    setErrors([]);
    setProgress(0);
    track("tool_start", { tool: slug });
    try {
      const { PDFDocument } = await loadPdfLib();
      const pdf = await PDFDocument.create();
      for (let k = 0; k < items.length; k++) {
        const f = items[k].file;
        // Re-encode JPG/WebP/GIF/BMP via canvas (normalises EXIF orientation); keep PNG bytes as-is.
        const img = await loadImage(f);
        let bytes: ArrayBuffer;
        let kind: "jpg" | "png";
        if (f.type === "image/png") {
          bytes = await f.arrayBuffer();
          kind = "png";
        } else if (f.type === "image/jpeg") {
          const c = drawToCanvas(img, img.naturalWidth, img.naturalHeight, { background: "#fff" });
          bytes = await (await canvasToBlob(c, "image/jpeg", 0.92)).arrayBuffer();
          kind = "jpg";
        } else {
          const c = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
          bytes = await (await canvasToBlob(c, "image/png")).arrayBuffer();
          kind = "png";
        }
        const embedded = kind === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const iw = embedded.width, ih = embedded.height;
        let pw: number, ph: number;
        const base = SIZES[size];
        if (!base) { pw = iw * 0.75 + 2 * mPt; ph = ih * 0.75 + 2 * mPt; }
        else {
          const landscape = orient === "landscape" || (orient === "auto" && iw > ih);
          [pw, ph] = landscape ? [base[1], base[0]] : base;
        }
        const aw = pw - 2 * mPt, ah = ph - 2 * mPt;
        if (aw <= 0 || ah <= 0) throw new Error("The margin is too large for the page size.");
        const s = Math.min(aw / iw, ah / ih);
        const dw = iw * s, dh = ih * s;
        const page = pdf.addPage([pw, ph]);
        page.drawImage(embedded, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
        setProgress((k + 1) / items.length);
      }
      setResult(await savePdf(pdf));
      track("tool_complete", { tool: slug });
    } catch (e) {
      setErrors([(e as Error).message || "Could not create the PDF."]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <FileDrop accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" multiple onFiles={add} label="choose images" hint={`JPG, PNG, WebP, GIF or BMP · up to ${MAX} images · each image becomes one page`} />
          {errors.map((e, i) => <Alert key={i} kind="error">{e}</Alert>)}
          {items.length > 0 && (
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {items.map((it, i) => (
                <li key={it.id} className="rounded-lg border border-border bg-surface-2 p-2">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.url} alt={`Page ${i + 1}: ${it.file.name}`} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-2">{i + 1}. {it.file.name}</p>
                  <div className="mt-1 flex justify-between">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${it.file.name} earlier`} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface disabled:opacity-30"><ArrowUp className="h-4 w-4" aria-hidden /></button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${it.file.name} later`} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface disabled:opacity-30"><ArrowDown className="h-4 w-4" aria-hidden /></button>
                    <button type="button" onClick={() => { URL.revokeObjectURL(it.url); setItems((c) => c.filter((x) => x.id !== it.id)); setResult(null); }} aria-label={`Remove ${it.file.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-danger"><X className="h-4 w-4" aria-hidden /></button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Page size" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">US Letter (8.5 × 11 in)</option>
              <option value="fit">Fit to image</option>
            </Select>
            <Select label="Orientation" value={orient} onChange={(e) => setOrient(e.target.value as typeof orient)} disabled={size === "fit"}>
              <option value="auto">Automatic (per image)</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </Select>
            <NumberField label="Margin" value={margin} onChange={setMargin} suffix="mm" min={0} max={50} />
          </div>
          {busy && <Progress value={progress} label="Building PDF" />}
          <Toolbar>
            <Button onClick={build} disabled={!items.length || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Create PDF
            </Button>
            {items.length > 0 && <ResetButton onClick={() => { items.forEach((i) => URL.revokeObjectURL(i.url)); setItems([]); setResult(null); setErrors([]); }} />}
          </Toolbar>
        </div>
      </Panel>
      {result && (
        <Panel title="PDF ready">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Pages" value={items.length} highlight />
              <Stat label="File size" value={formatBytes(result.size)} />
            </div>
            <Button onClick={() => { downloadBlob(result, "images.pdf"); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download PDF
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
