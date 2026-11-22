"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { searchTools, toolHref, categoryMap, tools } from "@/lib/tools/registry";
import ToolIcon from "@/components/ToolIcon";
import { track } from "@/lib/analytics";
import { cx } from "@/components/ui";

/**
 * Accessible combobox with keyboard navigation (↑ ↓ Enter Esc).
 * With `shortcut`, pressing "/" anywhere outside a text field focuses it.
 */
export default function SearchBox({
  large = false,
  onNavigate,
  autoFocus,
  shortcut = false,
}: {
  large?: boolean;
  onNavigate?: () => void;
  autoFocus?: boolean;
  shortcut?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchTools(q, 8), [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!shortcut) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      input.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

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
        <Search
          className={cx("pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted", large ? "left-5 h-5 w-5" : "left-3.5 h-4 w-4")}
          aria-hidden
        />
        <input
          ref={input}
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={autoFocus}
          placeholder={large ? `Try “compress image”, “merge PDF” or “GPA”` : "Search tools"}
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
            } else if (e.key === "Escape") {
              setOpen(false);
              input.current?.blur();
            }
          }}
          className={cx(
            "peer w-full border bg-surface text-ink transition-[border-color,box-shadow] placeholder:text-muted focus:border-ink/40 focus:outline-none focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden",
            large
              ? "h-16 rounded-2xl border-border-strong pl-14 pr-28 text-base shadow-pop sm:text-lg"
              : "h-10 rounded-full border-border pl-10 pr-10 text-sm",
          )}
        />
        {large ? (
          <button
            type="submit"
            className="absolute right-2 top-1/2 inline-flex h-12 -translate-y-1/2 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            Search
          </button>
        ) : (
          shortcut && (
            <span className="kbd pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 peer-focus:hidden" aria-hidden>
              /
            </span>
          )
        )}
      </form>
      {open && q.trim() && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`Tools matching ${q}`}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[26rem] overflow-auto rounded-2xl border border-border bg-surface p-1.5 text-left shadow-pop"
        >
          {results.length === 0 && (
            <li className="px-3 py-4 text-sm text-muted">
              No tools match “{q}”. Try a broader word, like “image” or “pdf”. We have {tools.length} tools.
            </li>
          )}
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
              className={cx(`tone-${t.category} flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2`, i === active && "bg-surface-2")}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tone-soft text-tone">
                <ToolIcon name={t.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{t.name}</span>
                <span className="block truncate text-xs text-muted">{categoryMap[t.category].name}</span>
              </span>
              {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-muted" aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
