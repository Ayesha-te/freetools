"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { PDFDocument } from "pdf-lib";
import { Alert, Button, Input, NumberField, Panel, Segmented, Toolbar, ResetButton, num } from "@/components/ui";
import { downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import { openPdf, savePdf, loadPdfLib } from "@/lib/pdf";
import { parseRangeGroups } from "@/lib/calc/dev";
import { track } from "@/lib/analytics";
import { PdfBadge, PdfPicker, Progress, useSinglePdf } from "./shared";
import type { ToolProps } from "../ToolRenderer";

type Part = { name: string; blob: Blob; pages: string };

export default function PdfSplitter({ slug }: ToolProps) {
  const { file, error, setError, pick, reset } = useSinglePdf();
  const [doc, setDoc] = useState<PDFDocument | null>(null);
  const [mode, setMode] = useState<"each" | "chunk" | "ranges">("each");
  const [chunk, setChunk] = useState("2");
  const [ranges, setRanges] = useState("1-3, 4-6");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parts, setParts] = useState<Part[]>([]);

  async function onFiles(f: File[]) {
    setParts([]);
    setDoc(null);
    const picked = await pick(f);
    if (!picked) return;
    try {
      setDoc(await openPdf(picked));
    } catch (e) {
      setError((e as Error).message);
      reset();
    }
  }

  async function split() {
    if (!doc || !file) return;
    setError("");
    setParts([]);
    const n = doc.getPageCount();
    let groups: number[][];
    try {
      if (mode === "each") groups = Array.from({ length: n }, (_, i) => [i]);
      else if (mode === "chunk") {
        const c = Math.floor(num(chunk));
        if (!Number.isFinite(c) || c < 1) throw new Error("Pages per file must be a whole number of at least 1.");
        groups = [];
        for (let i = 0; i < n; i += c) groups.push(Array.from({ length: Math.min(c, n - i) }, (_, k) => i + k));
      } else groups = parseRangeGroups(ranges, n);
    } catch (e) {
      return setError((e as Error).message);
    }
    if (groups.length > 500) return setError("That would create more than 500 files. Use larger chunks or custom ranges.");
    setBusy(true);
    track("tool_start", { tool: slug });
    try {
      const { PDFDocument } = await loadPdfLib();
      const out: Part[] = [];
      for (let g = 0; g < groups.length; g++) {
        const nd = await PDFDocument.create();
        const pages = await nd.copyPages(doc, groups[g]);
        pages.forEach((p) => nd.addPage(p));
        const first = groups[g][0] + 1, last = groups[g][groups[g].length - 1] + 1;
        const label = first === last ? `${first}` : `${first}-${last}`;
        out.push({ name: safeFilename(file.name, "pdf", `-pages-${label}`), blob: await savePdf(nd), pages: label });
        setProgress((g + 1) / groups.length);
      }
      setParts(out);
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function zipAll() {
    const { zipSync } = await import("fflate");
    const files: Record<string, Uint8Array> = {};
    for (const p of parts) files[p.name] = new Uint8Array(await p.blob.arrayBuffer());
    downloadBlob(new Blob([zipSync(files, { level: 0 }) as BlobPart], { type: "application/zip" }), safeFilename(file!.name, "zip", "-split"));
    track("tool_download", { tool: slug });
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {!file ? <PdfPicker onFiles={onFiles} /> : <PdfBadge file={file} pages={doc?.getPageCount()} onClear={() => { reset(); setDoc(null); setParts([]); }} />}
          <Segmented label="Split mode" value={mode} onChange={setMode} options={[{ value: "each", label: "Every page" }, { value: "chunk", label: "Every N pages" }, { value: "ranges", label: "Custom ranges" }]} />
          {mode === "chunk" && <NumberField label="Pages per file" value={chunk} onChange={setChunk} min={1} className="max-w-xs" />}
          {mode === "ranges" && <Input label="Ranges (each becomes one file)" value={ranges} onChange={(e) => setRanges(e.target.value)} hint="Separate files with commas. Example: 1-3, 4-6, 7 creates three PDFs. “8-” means page 8 to the end." />}
          {error && <Alert kind="error">{error}</Alert>}
          {busy && <Progress value={progress} label="Splitting" />}
          <Toolbar>
            <Button onClick={split} disabled={!doc || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Split PDF
            </Button>
            {file && <ResetButton onClick={() => { reset(); setDoc(null); setParts([]); }} />}
          </Toolbar>
        </div>
      </Panel>
      {parts.length > 0 && (
        <Panel title={`${parts.length} file${parts.length > 1 ? "s" : ""} created`}>
          <div className="space-y-3" aria-live="polite">
            {parts.length > 1 && (
              <Button onClick={zipAll}>
                <Download className="h-4 w-4" aria-hidden /> Download all as ZIP
              </Button>
            )}
            <ul className="max-h-96 divide-y divide-border overflow-auto rounded-lg border border-border">
              {parts.map((p) => (
                <li key={p.name} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate text-ink">Pages {p.pages}</span>
                  <span className="text-muted">{formatBytes(p.blob.size)}</span>
                  <Button variant="secondary" className="min-h-8 px-3 py-1" onClick={() => { downloadBlob(p.blob, p.name); track("tool_download", { tool: slug }); }}>
                    <Download className="h-4 w-4" aria-hidden /> PDF
                  </Button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted">Each part may be close to the original size if pages share fonts or images; shared resources are copied into every part.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
