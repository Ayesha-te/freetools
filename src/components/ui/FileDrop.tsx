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
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors",
        compact ? "gap-1 px-4 py-5" : "gap-2 px-6 py-10",
        over ? "border-primary bg-primary-soft" : "border-border-strong bg-surface-2/60 hover:border-primary/60",
      )}
    >
      <UploadCloud className={cx("text-primary", compact ? "h-6 w-6" : "h-10 w-10")} aria-hidden />
      <p className="text-sm font-medium text-ink">
        Drag and drop {multiple ? "files" : "a file"} here, or{" "}
        <button type="button" onClick={() => input.current?.click()} className="font-semibold text-primary underline underline-offset-2">
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
