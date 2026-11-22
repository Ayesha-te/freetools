"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Download, Loader2, X, FileText } from "lucide-react";
import { Alert, Button, Panel, Stat, Toolbar, ResetButton } from "@/components/ui";
import { downloadBlob, formatBytes } from "@/lib/image";
import { openPdf, savePdf, validatePdf, loadPdfLib } from "@/lib/pdf";
import { track } from "@/lib/analytics";
import { PdfPicker, Progress } from "./shared";
import type { ToolProps } from "../ToolRenderer";

const MAX_FILES = 50;
const MAX_TOTAL = 300 * 1024 * 1024;

export default function PdfMerger({ slug }: ToolProps) {
  const [files, setFiles] = useState<{ id: string; file: File }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  async function add(list: File[]) {
    const errs: string[] = [];
    const ok: { id: string; file: File }[] = [];
    for (const f of list) {
      const v = await validatePdf(f);
      if (v) errs.push(v);
      else ok.push({ id: `${f.name}-${f.size}-${Math.random()}`, file: f });
    }
    setFiles((cur) => [...cur, ...ok].slice(0, MAX_FILES));
    setErrors(errs);
    setResult(null);
  }

  function move(i: number, d: -1 | 1) {
    setFiles((cur) => {
      const n = [...cur];
      const j = i + d;
      if (j < 0 || j >= n.length) return cur;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    setResult(null);
  }

  async function merge() {
    const total = files.reduce((s, f) => s + f.file.size, 0);
    if (total > MAX_TOTAL) return setErrors(["The combined size is over 300 MB, which is likely to exhaust browser memory. Merge in smaller batches."]);
    setBusy(true);
    setErrors([]);
    setProgress(0);
    track("tool_start", { tool: slug });
    try {
      const { PDFDocument } = await loadPdfLib();
      const out = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const src = await openPdf(files[i].file);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
        setProgress((i + 1) / (files.length + 1));
      }
      const blob = await savePdf(out);
      setProgress(1);
      setResult({ blob, pages: out.getPageCount() });
      track("tool_complete", { tool: slug });
    } catch (e) {
      setErrors([(e as Error).message]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          <PdfPicker multiple onFiles={add} />
          {errors.map((e, i) => (
            <Alert key={i} kind="error">
              {e}
            </Alert>
          ))}
          {files.length > 0 && (
            <>
              <p className="text-sm text-muted">Files are merged from top to bottom. Use the arrows to change the order.</p>
              <ol className="divide-y divide-border rounded-lg border border-border">
                {files.map((f, i) => (
                  <li key={f.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <span className="w-6 text-center font-semibold text-muted">{i + 1}</span>
                    <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-ink">{f.file.name}</span>
                    <span className="hidden text-muted sm:inline">{formatBytes(f.file.size)}</span>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${f.file.name} up`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-2 hover:bg-surface-2 disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label={`Move ${f.file.name} down`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-2 hover:bg-surface-2 disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => { setFiles((c) => c.filter((x) => x.id !== f.id)); setResult(null); }} aria-label={`Remove ${f.file.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-danger">
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
          {busy && <Progress value={progress} label="Merging" />}
          <Toolbar>
            <Button onClick={merge} disabled={files.length < 2 || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Merge {files.length || ""} PDFs
            </Button>
            {files.length > 0 && <ResetButton onClick={() => { setFiles([]); setResult(null); setErrors([]); }} />}
          </Toolbar>
          {files.length === 1 && <p className="text-sm text-muted">Add at least one more PDF to merge.</p>}
        </div>
      </Panel>
      {result && (
        <Panel title="Merged PDF ready">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Pages" value={result.pages} highlight />
              <Stat label="File size" value={formatBytes(result.blob.size)} />
            </div>
            <Button onClick={() => { downloadBlob(result.blob, "merged.pdf"); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download merged PDF
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
