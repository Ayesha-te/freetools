"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchTools, toolHref, categoryMap } from "@/lib/tools/registry";
import ToolIcon from "@/components/ToolIcon";
import { track } from "@/lib/analytics";
import { cx } from "@/components/ui";

/** Accessible combobox with keyboard navigation (↑ ↓ Enter Esc). */
export default function SearchBox({ large = false, onNavigate, autoFocus }: { large?: boolean; onNavigate?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchTools(q, 8), [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(slug: string) {
    track("search", { query_length: q.length, result_count: results.length });
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(toolHref(slug));
  }

  return (
    <div ref={wrap} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[active]) go(results[active].slug);
          else if (q.trim()) {
            onNavigate?.();
            router.push(`/tools/?q=${encodeURIComponent(q.trim())}`);
          }
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search tools
        </label>
        <Search className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted", large ? "h-5 w-5" : "h-4 w-4")} aria-hidden />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={large ? "Search 47 tools, e.g. “compress image” or “GPA”" : "Search tools…"}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Escape") setOpen(false);
          }}
          className={cx(
            "w-full rounded-xl border border-border-strong bg-surface text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
            large ? "h-14 pl-11 pr-4 text-base shadow-sm" : "h-10 pl-9 pr-3 text-sm",
          )}
        />
      </form>
      {open && q.trim() && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {results.length === 0 && <li className="px-3 py-3 text-sm text-muted">No tools match “{q}”.</li>}
          {results.map((t, i) => (
            <li
              key={t.slug}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                go(t.slug);
              }}
              onMouseEnter={() => setActive(i)}
              className={cx("flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2", i === active && "bg-primary-soft")}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-primary">
                <ToolIcon name={t.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{t.name}</span>
                <span className="block truncate text-xs text-muted">{categoryMap[t.category].name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
