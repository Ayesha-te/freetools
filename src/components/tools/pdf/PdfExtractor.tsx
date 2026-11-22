"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { PDFDocument } from "pdf-lib";
import { Alert, Button, Input, Panel, Stat, Toolbar, ResetButton } from "@/components/ui";
import { downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import { openPdf, savePdf, thumbnails, loadPdfLib } from "@/lib/pdf";
import { parsePageRanges } from "@/lib/calc/dev";
import { track } from "@/lib/analytics";
import { PdfBadge, PdfPicker, useSinglePdf } from "./shared";
import PageGrid from "./PageGrid";
import type { ToolProps } from "../ToolRenderer";

function toRangeString(sel: number[]) {
  const s = [...sel].sort((a, b) => a - b).map((x) => x + 1);
  const parts: string[] = [];
  for (let i = 0; i < s.length; i++) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    parts.push(i === j ? `${s[i]}` : `${s[i]}-${s[j]}`);
    i = j;
  }
  return parts.join(", ");
}

export default function PdfExtractor({ slug }: ToolProps) {
  const { file, error, setError, pick, reset } = useSinglePdf();
  const [doc, setDoc] = useState<PDFDocument | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  async function onFiles(f: File[]) {
    setResult(null);
    const picked = await pick(f);
    if (!picked) return;
    try {
      const d = await openPdf(picked);
      setDoc(d);
      setSelected(new Set());
      setRanges("");
      setThumbs([]);
      thumbnails(await picked.arrayBuffer(), 60).then(setThumbs).catch(() => setThumbs([]));
    } catch (e) {
      setError((e as Error).message);
      reset();
    }
  }

  function toggle(i: number) {
    const n = new Set(selected);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    setSelected(n);
    setRanges(toRangeString([...n]));
    setResult(null);
  }

  function applyRanges(v: string) {
    setRanges(v);
    if (!doc) return;
    try {
      setSelected(new Set(parsePageRanges(v, doc.getPageCount())));
      setError("");
    } catch {
      /* show error on submit */
    }
  }

  async function extract() {
    if (!doc || !file) return;
    setError("");
    let idx: number[];
    try {
      idx = parsePageRanges(ranges, doc.getPageCount());
    } catch (e) {
      return setError((e as Error).message);
    }
    setBusy(true);
    track("tool_start", { tool: slug });
    try {
      const { PDFDocument } = await loadPdfLib();
      const nd = await PDFDocument.create();
      (await nd.copyPages(doc, idx)).forEach((p) => nd.addPage(p));
      setResult({ blob: await savePdf(nd), pages: idx.length });
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const clear = () => { reset(); setDoc(null); setThumbs([]); setResult(null); setSelected(new Set()); setRanges(""); };

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {!file ? <PdfPicker onFiles={onFiles} /> : <PdfBadge file={file} pages={doc?.getPageCount()} onClear={clear} />}
          {doc && (
            <>
              <Input label="Pages to extract" value={ranges} onChange={(e) => applyRanges(e.target.value)} placeholder="e.g. 1-3, 7, 10-12" hint="Type page numbers or click thumbnails below. Pages are saved in document order." />
              <PageGrid thumbs={thumbs} total={doc.getPageCount()} selected={selected} onToggle={toggle} />
            </>
          )}
          {error && <Alert kind="error">{error}</Alert>}
          <Toolbar>
            <Button onClick={extract} disabled={!doc || !ranges.trim() || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Extract {selected.size || ""} page{selected.size === 1 ? "" : "s"}
            </Button>
            {file && <ResetButton onClick={clear} />}
          </Toolbar>
        </div>
      </Panel>
      {result && file && (
        <Panel title="New PDF ready">
          <div className="space-y-4" aria-live="polite">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Pages" value={result.pages} highlight />
              <Stat label="File size" value={formatBytes(result.blob.size)} />
            </div>
            <Button onClick={() => { downloadBlob(result.blob, safeFilename(file.name, "pdf", "-extracted")); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download PDF
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
