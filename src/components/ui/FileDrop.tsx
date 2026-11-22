"use client";

import { useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cx } from "./index";

export default function FileDrop({
  accept,
  multiple = false,
  onFiles,
  label,
  hint,
  compact = false,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  hint?: string;
  compact?: boolean;
}) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  function handle(list: FileList | null) {
    if (!list || !list.length) return;
    const files = Array.from(list);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
      className={cx(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors",
        compact ? "gap-1.5 px-4 py-5" : "gap-3 px-6 py-12",
        over ? "border-primary bg-primary-soft" : "border-border-strong bg-surface hover:border-primary/60 hover:bg-primary-soft/40",
      )}
    >
      <span className={cx("flex items-center justify-center rounded-2xl bg-primary-soft text-primary", compact ? "h-10 w-10" : "h-14 w-14")}>
        <UploadCloud className={compact ? "h-5 w-5" : "h-7 w-7"} aria-hidden />
      </span>
      <p className="text-sm font-medium text-ink">
        Drag and drop {multiple ? "files" : "a file"} here, or{" "}
        <button type="button" onClick={() => input.current?.click()} className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
          {label}
        </button>
      </p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <input
        id={id}
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
