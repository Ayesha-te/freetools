"use client";

import { cx } from "@/components/ui";

/** Grid of page thumbnails. Supports selection and per-page rotation display. */
export default function PageGrid({
  thumbs,
  total,
  selected,
  onToggle,
  rotations,
  renderAction,
}: {
  thumbs: string[];
  total: number;
  selected?: Set<number>;
  onToggle?: (i: number) => void;
  rotations?: number[];
  renderAction?: (i: number) => React.ReactNode;
}) {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: total }, (_, i) => {
          const sel = selected?.has(i);
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => onToggle?.(i)}
                disabled={!onToggle}
                aria-pressed={onToggle ? !!sel : undefined}
                aria-label={`Page ${i + 1}${onToggle ? (sel ? ", selected" : ", not selected") : ""}`}
                className={cx(
                  "flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-md border-2 bg-white p-1",
                  sel ? "border-primary ring-2 ring-primary/30" : "border-border",
                  !onToggle && "cursor-default",
                )}
              >
                {thumbs[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbs[i]} alt="" className="max-h-full max-w-full transition-transform" style={{ transform: `rotate(${rotations?.[i] ?? 0}deg)` }} />
                ) : (
                  <span className="text-xs text-slate-400">Page {i + 1}</span>
                )}
              </button>
              <span className="text-xs text-muted">{i + 1}</span>
              {renderAction?.(i)}
            </li>
          );
        })}
      </ul>
      {thumbs.length < total && <p className="mt-2 text-xs text-muted">Previews are shown for the first {thumbs.length} pages to save memory; all pages can still be selected by number.</p>}
    </div>
  );
}
