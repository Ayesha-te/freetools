"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FileDrop from "@/components/ui/FileDrop";
import { formatBytes } from "@/lib/image";
import { validatePdf } from "@/lib/pdf";

export function PdfPicker({ onFiles, multiple = false }: { onFiles: (f: File[]) => void; multiple?: boolean }) {
  return (
    <FileDrop
      accept="application/pdf,.pdf"
      multiple={multiple}
      onFiles={onFiles}
      label={multiple ? "choose PDF files" : "choose a PDF"}
      hint={`PDF ${multiple ? "files" : "file"} · up to 100 MB each · processed in your browser`}
    />
  );
}

export function useSinglePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  async function pick(files: File[]) {
    setError("");
    const f = files[0];
    if (!f) return null;
    const v = await validatePdf(f);
    if (v) {
      setError(v);
      return null;
    }
    setFile(f);
    return f;
  }
  return { file, error, setError, pick, reset: () => { setFile(null); setError(""); } };
}

export function PdfBadge({ file, pages, onClear }: { file: File; pages?: number; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
      <span className="min-w-0 truncate text-ink">
        <strong className="font-medium">{file.name}</strong>
        <span className="text-muted">
          {" "}· {formatBytes(file.size)}
          {pages ? ` · ${pages} page${pages > 1 ? "s" : ""}` : ""}
        </span>
      </span>
      <button type="button" onClick={onClear} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-danger" aria-label="Remove PDF">
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={label}>
        <div className="h-full bg-primary transition-[width]" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}
