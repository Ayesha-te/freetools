import type { ReactNode } from "react";
import { Plus } from "lucide-react";

/** Native <details> accordion: works without JavaScript and keeps every answer in the HTML for search engines. */
export default function FaqList({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="not-prose divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {items.map((f, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 font-medium text-ink transition-colors hover:bg-surface-2/60">
            <span>{f.q}</span>
            <Plus className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <div className="px-5 pb-5 text-[0.95rem] leading-relaxed text-ink-2">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
