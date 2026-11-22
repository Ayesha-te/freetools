"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Alert, Button, Panel, Segmented, Select, Stat, Toolbar, ResetButton } from "@/components/ui";
import { canvasToBlob, downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import { openPdf, openPdfJs, renderPage, savePdf, loadPdfLib } from "@/lib/pdf";
import { track } from "@/lib/analytics";
import { PdfBadge, PdfPicker, Progress, useSinglePdf } from "./shared";
import type { ToolProps } from "../ToolRenderer";

const LEVELS = {
  light: { dpi: 150, q: 0.75, label: "Light (150 DPI, good quality)" },
  medium: { dpi: 110, q: 0.6, label: "Medium (110 DPI)" },
  strong: { dpi: 80, q: 0.5, label: "Strong (80 DPI, smallest)" },
};

export default function PdfCompressor({ slug }: ToolProps) {
  const { file, error, setError, pick, reset } = useSinglePdf();
  const [mode, setMode] = useState<"lossless" | "raster">("lossless");
  const [level, setLevel] = useState<keyof typeof LEVELS>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    setProgress(0);
    track("tool_start", { tool: slug });
    try {
      if (mode === "lossless") {
        const d = await openPdf(file);
        // remove metadata bloat and re-save with compressed object streams
        d.setProducer("FreeTools Hub");
        d.setCreator("FreeTools Hub");
        setProgress(0.5);
        setResult(await savePdf(d));
      } else {
        const { PDFDocument } = await loadPdfLib();
        const cfg = LEVELS[level];
        const src = await openPdfJs(await file.arrayBuffer());
        if (src.numPages > 300) throw new Error("Image-based compression supports up to 300 pages at a time.");
        const out = await PDFDocument.create();
        for (let i = 1; i <= src.numPages; i++) {
          const page = await src.getPage(i);
          const vp = page.getViewport({ scale: 1, rotation: page.rotate });
          const c = await renderPage(src, i, cfg.dpi / 72);
          const jpg = await canvasToBlob(c, "image/jpeg", cfg.q);
          c.width = c.height = 0;
          const img = await out.embedJpg(await jpg.arrayBuffer());
          const p = out.addPage([vp.width, vp.height]);
          p.drawImage(img, { x: 0, y: 0, width: vp.width, height: vp.height });
          setProgress(i / src.numPages);
        }
        await src.destroy();
        setResult(await savePdf(out));
      }
      setProgress(1);
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message || "Compression failed.");
    } finally {
      setBusy(false);
    }
  }

  const saved = file && result ? 1 - result.size / file.size : 0;

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {!file ? <PdfPicker onFiles={(f) => { setResult(null); pick(f); }} /> : <PdfBadge file={file} onClear={() => { reset(); setResult(null); }} />}
          <Segmented label="Compression method" value={mode} onChange={(v) => { setMode(v); setResult(null); }} options={[{ value: "lossless", label: "Lossless cleanup" }, { value: "raster", label: "Image-based (stronger)" }]} />
          {mode === "lossless" ? (
            <p className="text-sm text-ink-2">Rebuilds the file structure and packs objects into compressed streams. Text, links and quality are unchanged. Savings are usually small (0–20%) and some PDFs cannot be reduced this way.</p>
          ) : (
            <>
              <Alert kind="warn" title="Important trade-off">
                Each page is converted into a JPEG image. This can shrink scanned or image-heavy PDFs a lot, but text will no longer be selectable or searchable, links and form fields are removed, and small text may look softer.
              </Alert>
              <Select label="Strength" value={level} onChange={(e) => setLevel(e.target.value as keyof typeof LEVELS)} className="max-w-sm">
                {Object.entries(LEVELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </>
          )}
          {error && <Alert kind="error">{error}</Alert>}
          {busy && <Progress value={progress} label="Compressing" />}
          <Toolbar>
            <Button onClick={run} disabled={!file || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Compress PDF
            </Button>
            {file && <ResetButton onClick={() => { reset(); setResult(null); }} />}
          </Toolbar>
        </div>
      </Panel>
      {result && file && (
        <Panel title="Result">
          <div className="space-y-4" aria-live="polite">
            {saved <= 0.005 ? (
              <Alert kind="warn" title="No reduction achieved">
                The new file is {formatBytes(result.size)} versus {formatBytes(file.size)} originally. This PDF is already efficiently compressed{mode === "lossless" ? " — try the image-based method if it is a scan" : " or contains mostly text, which is smaller as vector data than as images"}. We recommend keeping your original file.
              </Alert>
            ) : (
              <Alert kind="success">Reduced by {(saved * 100).toFixed(1)}%.</Alert>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat label="New size" value={formatBytes(result.size)} highlight />
              <Stat label="Change" value={`${saved > 0 ? "−" : "+"}${Math.abs(saved * 100).toFixed(1)}%`} />
            </div>
            <Button variant={saved > 0.005 ? "primary" : "secondary"} onClick={() => { downloadBlob(result, safeFilename(file.name, "pdf", "-compressed")); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download {saved > 0.005 ? "compressed" : "re-saved"} PDF
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
