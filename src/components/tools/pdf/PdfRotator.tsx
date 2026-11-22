"use client";

import { useState } from "react";
import { Download, Loader2, RotateCcw, RotateCw } from "lucide-react";
import { Alert, Button, Panel, Toolbar, ResetButton } from "@/components/ui";
import { downloadBlob, formatBytes, safeFilename } from "@/lib/image";
import { openPdf, savePdf, thumbnails, loadPdfLib } from "@/lib/pdf";
import { track } from "@/lib/analytics";
import { PdfBadge, PdfPicker, useSinglePdf } from "./shared";
import PageGrid from "./PageGrid";
import type { ToolProps } from "../ToolRenderer";

export default function PdfRotator({ slug }: ToolProps) {
  const { file, error, setError, pick, reset } = useSinglePdf();
  const [count, setCount] = useState(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [rot, setRot] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);

  async function onFiles(f: File[]) {
    setResult(null);
    const picked = await pick(f);
    if (!picked) return;
    try {
      const d = await openPdf(picked);
      setCount(d.getPageCount());
      setRot(new Array(d.getPageCount()).fill(0));
      setThumbs([]);
      thumbnails(await picked.arrayBuffer(), 60).then(setThumbs).catch(() => setThumbs([]));
    } catch (e) {
      setError((e as Error).message);
      reset();
    }
  }

  const turn = (i: number, d: number) => { setRot((r) => r.map((v, k) => (k === i ? (v + d + 360) % 360 : v))); setResult(null); };
  const turnAll = (d: number) => { setRot((r) => r.map((v) => (v + d + 360) % 360)); setResult(null); };

  async function save() {
    if (!file) return;
    setBusy(true);
    setError("");
    track("tool_start", { tool: slug });
    try {
      const { degrees } = await loadPdfLib();
      const d = await openPdf(file);
      d.getPages().forEach((p, i) => {
        if (rot[i]) p.setRotation(degrees((p.getRotation().angle + rot[i]) % 360));
      });
      setResult(await savePdf(d));
      track("tool_complete", { tool: slug });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const clear = () => { reset(); setCount(0); setThumbs([]); setRot([]); setResult(null); };
  const changed = rot.some((r) => r !== 0);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="space-y-4">
          {!file ? <PdfPicker onFiles={onFiles} /> : <PdfBadge file={file} pages={count} onClear={clear} />}
          {count > 0 && (
            <>
              <Toolbar>
                <span className="text-sm font-medium text-ink">All pages:</span>
                <Button variant="secondary" onClick={() => turnAll(-90)}>
                  <RotateCcw className="h-4 w-4" aria-hidden /> Left 90°
                </Button>
                <Button variant="secondary" onClick={() => turnAll(90)}>
                  <RotateCw className="h-4 w-4" aria-hidden /> Right 90°
                </Button>
                <Button variant="secondary" onClick={() => turnAll(180)}>
                  180°
                </Button>
              </Toolbar>
              <PageGrid
                thumbs={thumbs}
                total={count}
                rotations={rot}
                renderAction={(i) => (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => turn(i, -90)} aria-label={`Rotate page ${i + 1} left`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-2 hover:bg-surface-2">
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button type="button" onClick={() => turn(i, 90)} aria-label={`Rotate page ${i + 1} right`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-2 hover:bg-surface-2">
                      <RotateCw className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                )}
              />
            </>
          )}
          {error && <Alert kind="error">{error}</Alert>}
          <Toolbar>
            <Button onClick={save} disabled={!file || !changed || busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Apply rotation
            </Button>
            {file && <ResetButton onClick={() => { setRot(new Array(count).fill(0)); setResult(null); }} />}
          </Toolbar>
          {file && !changed && <p className="text-sm text-muted">Rotate at least one page to continue.</p>}
        </div>
      </Panel>
      {result && file && (
        <Panel title="Rotated PDF ready">
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm text-ink-2">File size: {formatBytes(result.size)}</p>
            <Button onClick={() => { downloadBlob(result, safeFilename(file.name, "pdf", "-rotated")); track("tool_download", { tool: slug }); }}>
              <Download className="h-4 w-4" aria-hidden /> Download rotated PDF
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
