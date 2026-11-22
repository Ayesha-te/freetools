"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, X } from "lucide-react";
import { Alert, Button, Field, Panel, Toolbar, ResetButton } from "@/components/ui";
import { canvasToBlob, downloadBlob, drawToCanvas, formatBytes, loadImage, safeFilename, validateImageFile } from "@/lib/image";
import { track } from "@/lib/analytics";
import { ImagePicker } from "./shared";
import type { ToolProps } from "../ToolRenderer";

interface Item {
  id: string;
  file: File;
  status: "pending" | "done" | "error";
  out?: Blob;
  error?: string;
}

const MAX_FILES = 30;

export default function ImageConverter({ slug }: ToolProps) {
  const toPng = slug === "jpg-to-png";
  const inType = toPng ? "image/jpeg" : "image/png";
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(90);
  const [bg, setBg] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setItems([]), [slug]);

  function add(files: File[]) {
    setError("");
    const errs: string[] = [];
    const next: Item[] = [];
    for (const f of files) {
      const v = validateImageFile(f, [inType]);
      if (v) errs.push(v);
      else next.push({ id: `${f.name}-${f.size}-${Math.random()}`, file: f, status: "pending" });
    }
    setItems((cur) => {
      const merged = [...cur, ...next];
      if (merged.length > MAX_FILES) errs.push(`Only the first ${MAX_FILES} files were added.`);
      return merged.slice(0, MAX_FILES);
    });
    if (errs.length) setError(errs.join(" "));
  }

  async function convertAll() {
    setBusy(true);
    track("tool_start", { tool: slug });
    const out: Item[] = [];
    for (const it of items) {
      try {
        const img = await loadImage(it.file);
        const c = drawToCanvas(img, img.naturalWidth, img.naturalHeight, { background: toPng ? undefined : bg });
        const blob = await canvasToBlob(c, toPng ? "image/png" : "image/jpeg", toPng ? undefined : quality / 100);
        out.push({ ...it, status: "done", out: blob });
      } catch (e) {
        out.push({ ...it, status: "error", error: (e as Error).message });
      }
    }
    setItems(out);
    setBusy(false);
    if (out.some((i) => i.status === "done")) track("tool_complete", { tool: slug });
  }

  const ext = toPng ? "png" : "jpg";
  const done = items.filter((i) => i.out);

  return (
    <Panel>
      <div className="space-y-4">
        <ImagePicker multiple accept={toPng ? "image/jpeg,.jpg,.jpeg" : "image/png,.png"} onFiles={add} hint={`${toPng ? "JPG/JPEG" : "PNG"} files · up to ${MAX_FILES} at once · 40 MB each · converted on your device`} />
        {!toPng && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jq" className="text-sm font-medium text-ink">
                JPG quality: {quality}%
              </label>
              <input id="jq" type="range" min={40} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="h-10 accent-[var(--primary)]" />
            </div>
            <Field label="Background for transparent areas" htmlFor="bg" hint="JPG cannot store transparency.">
              <div className="flex items-center gap-2">
                <input id="bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 cursor-pointer rounded border border-border-strong bg-surface" />
                <span className="font-mono text-sm text-ink-2">{bg}</span>
              </div>
            </Field>
          </div>
        )}
        {error && <Alert kind="error">{error}</Alert>}
        {items.length > 0 && (
          <ul className="divide-y divide-border rounded-lg border border-border" aria-live="polite">
            {items.map((it) => (
              <li key={it.id} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-ink">{it.file.name}</span>
                <span className="text-muted">{formatBytes(it.file.size)}</span>
                {it.status === "done" && it.out && (
                  <>
                    <span className="text-success">→ {formatBytes(it.out.size)}</span>
                    <Button variant="secondary" className="min-h-8 px-3 py-1" onClick={() => { downloadBlob(it.out!, safeFilename(it.file.name, ext)); track("tool_download", { tool: slug }); }}>
                      <Download className="h-4 w-4" aria-hidden /> {ext.toUpperCase()}
                    </Button>
                  </>
                )}
                {it.status === "error" && <span className="text-danger">{it.error}</span>}
                <button type="button" aria-label={`Remove ${it.file.name}`} onClick={() => setItems((c) => c.filter((x) => x.id !== it.id))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-danger">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Toolbar>
          <Button onClick={convertAll} disabled={!items.length || busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Convert {items.length > 1 ? `${items.length} images` : "image"} to {ext.toUpperCase()}
          </Button>
          {done.length > 1 && (
            <Button
              variant="secondary"
              onClick={async () => {
                const { zipSync } = await import("fflate");
                const files: Record<string, Uint8Array> = {};
                for (const d of done) {
                  let name = safeFilename(d.file.name, ext);
                  let n = 1;
                  while (files[name]) name = safeFilename(d.file.name, ext, `-${n++}`);
                  files[name] = new Uint8Array(await d.out!.arrayBuffer());
                }
                downloadBlob(new Blob([zipSync(files, { level: 0 }) as BlobPart], { type: "application/zip" }), `converted-${ext}.zip`);
                track("tool_download", { tool: slug });
              }}
            >
              <Download className="h-4 w-4" aria-hidden /> Download all (ZIP)
            </Button>
          )}
          {items.length > 0 && <ResetButton onClick={() => { setItems([]); setError(""); }} />}
        </Toolbar>
        {toPng && done.length > 0 && <p className="text-sm text-muted">PNG files are lossless, so they are usually larger than the original JPG. This is expected.</p>}
      </div>
    </Panel>
  );
}
