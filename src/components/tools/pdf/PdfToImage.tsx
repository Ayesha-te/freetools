"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Alert, Button, Input, Panel, Select, Toolbar, ResetButton } from "@/components/ui";
import { canvasToBlob, downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import { openPdfJs, renderPage } from "@/lib/pdf";
import { parsePageRanges } from "@/lib/calc/dev";
import { track } from "@/lib/analytics";
import { PdfBadge, PdfPicker, Progress, useSinglePdf } from "./shared";
import type { ToolProps } from "../ToolRenderer";

interface Out { page: number; blob: Blob; url: string; w: number; h: number }

export default function PdfToImage({ slug }: ToolProps) {
  const { file, error, setError, pick, reset } = useSinglePdf();
  const [pages, setPages] = useState(0);
  const [range, setRange] = useState("");
  const [dpi, setDpi] = useState("150");
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outs, setOuts] = useState<Out[]>([]);

  useEffect(() => () => outs.forEach((o) => URL.revokeObjectURL(o.url)), [outs]);

  async function onFiles(f: File[]) {
    setOuts([]);
    const picked = await pick(f);
    if (!picked) return;
    try {
      const doc = await openPdfJs(await picked.arrayBuffer());
      setPages(doc.numPages);
      setRange(doc.numPages > 1 ? `1-${doc.numPages}` : "1");
      await doc.destroy();
    } catch (e) {
      setError((e as Error).message);
      reset();
    }
  }

  async function convert() {
    if (!file) return;
    setError("");
    let idx: number[];
    try {
      idx = parsePageRanges(range, pages);
    } catch (e) {
      return setError((e as Error).message);
    }
    const scale = Number(dpi) / 72;
    if (idx.length > 200) return setError("Please convert at most 200 pages at a time.");
    setBusy(true);
    setProgress(0);
    setOuts([]);
    track("tool_start", { tool: slug });
    try {
      const doc = await openPdfJs(await file.arrayBuffer());
      const res: Out[] = [];
      for (let k = 0; k < idx.length; k++) {
        const c = await renderPage(doc, idx[k] + 1, scale);
        const blob = await canvasToBlob(c, format, format === "image/jpeg" ? 0.9 : undefined);
        res.push({ page: idx[k] + 1, blob, url: URL.createObjectURL(blob), w: c.width, h: c.height });
        c.width = c.height = 0; // release canvas memory
        setProgress((k + 1) / idx.length);
      }
      await doc.destroy();
      setOuts(res);
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message || "Rendering failed. Try a lower resolution.");
    } finally {
      setBusy(false);
    }
  }

  const ext = format === "image/png" ? "png" : "jpg";
  const name = (p: number) => safeFilename(file?.name || "page.pdf", ext, `-page-${p}`);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {!file ? <PdfPicker onFiles={onFiles} /> : <PdfBadge file={file} pages={pages} onClear={() => { reset(); setPages(0); setOuts([]); }} />}
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Pages" value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 1-3, 5" disabled={!pages} />
            <Select label="Resolution" value={dpi} onChange={(e) => setDpi(e.target.value)} hint="Higher DPI = sharper but larger images.">
              <option value="72">72 DPI (screen preview)</option>
              <option value="150">150 DPI (standard)</option>
              <option value="200">200 DPI (sharp)</option>
              <option value="300">300 DPI (print)</option>
            </Select>
            <Select label="Image format" value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
              <option value="image/jpeg">JPG (smaller)</option>
              <option value="image/png">PNG (lossless)</option>
            </Select>
          </div>
          {error && <Alert kind="error">{error}</Alert>}
          {busy && <Progress value={progress} label="Rendering pages" />}
          <Toolbar>
            <Button onClick={convert} disabled={!file || !pages || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Convert to {ext.toUpperCase()}
            </Button>
            {file && <ResetButton onClick={() => { reset(); setPages(0); setOuts([]); }} />}
          </Toolbar>
        </div>
      </Panel>
      {outs.length > 0 && (
        <Panel title={`${outs.length} image${outs.length > 1 ? "s" : ""} ready`}>
          <div className="space-y-4" aria-live="polite">
            {outs.length > 1 && (
              <Button
                onClick={async () => {
                  const { zipSync } = await import("fflate");
                  const files: Record<string, Uint8Array> = {};
                  for (const o of outs) files[name(o.page)] = new Uint8Array(await o.blob.arrayBuffer());
                  downloadBlob(new Blob([zipSync(files, { level: 0 }) as BlobPart], { type: "application/zip" }), safeFilename(file!.name, "zip", "-images"));
                  track("tool_download", { tool: slug });
                }}
              >
                <Download className="h-4 w-4" aria-hidden /> Download all as ZIP
              </Button>
            )}
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {outs.map((o) => (
                <li key={o.page} className="rounded-lg border border-border bg-surface-2 p-2">
                  <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.url} alt={`Page ${o.page} rendered as image`} className="max-h-full max-w-full" />
                  </div>
                  <p className="mt-1 text-xs text-ink-2">Page {o.page} · {o.w}×{o.h} · {formatBytes(o.blob.size)}</p>
                  <Button variant="secondary" className="mt-1 min-h-8 w-full px-2 py-1" onClick={() => { downloadBlob(o.blob, name(o.page)); track("tool_download", { tool: slug }); }}>
                    <Download className="h-4 w-4" aria-hidden /> {ext.toUpperCase()}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      )}
    </div>
  );
}
