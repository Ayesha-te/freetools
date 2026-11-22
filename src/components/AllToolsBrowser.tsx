"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { categories, categoryHref, searchTools, toolsInCategory } from "@/lib/tools/registry";
import ToolCard from "./ToolCard";
import ToolIcon from "./ToolIcon";
import { track } from "@/lib/analytics";
import { cx } from "./ui";

/** The full grouped list. Also rendered on the server as the Suspense fallback, so every tool link is in the static HTML. */
export function ToolGroups({ only }: { only?: string | null }) {
  return (
    <>
      {categories
        .filter((c) => !only || c.slug === only)
        .map((c) => (
          <section key={c.slug} className={`tone-${c.slug} mt-12 scroll-mt-24`} id={c.slug} aria-labelledby={`all-${c.slug}`}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tone-soft text-tone">
                <ToolIcon name={c.icon} className="h-[18px] w-[18px]" />
              </span>
              <h2 id={`all-${c.slug}`} className="text-2xl font-bold text-ink">
                <Link href={categoryHref(c.slug)} className="hover:underline hover:underline-offset-4">
                  {c.name}
                </Link>
              </h2>
              <span className="font-mono text-xs text-muted">{toolsInCategory(c.slug).length}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {toolsInCategory(c.slug).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        ))}
    </>
  );
}

export function FilterBar({
  q,
  setQ,
  cat,
  setCat,
}: {
  q: string;
  setQ?: (v: string) => void;
  cat: string | null;
  setCat?: (v: string | null) => void;
}) {
  const chip = "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";
  return (
    <div className="sticky top-16 z-30 -mx-4 mt-8 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <label htmlFor="filter" className="sr-only">
            Filter tools
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="filter"
            type="search"
            value={q}
            onChange={(e) => setQ?.(e.target.value)}
            placeholder="Filter by name or task…"
            className="h-11 w-full rounded-full border border-border-strong bg-surface pl-10 pr-10 text-ink placeholder:text-muted focus:border-ink/40 focus:outline-none focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button type="button" onClick={() => setQ?.("")} aria-label="Clear filter" className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink">
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:px-0 [scrollbar-width:none]" role="group" aria-label="Filter by category">
          <button type="button" aria-pressed={!cat} onClick={() => setCat?.(null)} className={cx(chip, !cat ? "border-ink bg-ink text-bg" : "border-border bg-surface text-ink-2 hover:border-ink/30")}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={cat === c.slug}
              onClick={() => setCat?.(cat === c.slug ? null : c.slug)}
              className={cx(chip, cat === c.slug ? "border-ink bg-ink text-bg" : "border-border bg-surface text-ink-2 hover:border-ink/30")}
            >
              {c.name.replace(" Tools", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AllToolsBrowser() {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  useEffect(() => {
    const initial = params.get("q");
    if (initial) setQ(initial.slice(0, 100));
  }, [params]);

  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => track("search", { query_length: q.length }), 800);
    return () => clearTimeout(t);
  }, [q]);

  const results = q.trim() ? searchTools(q).filter((t) => !cat || t.category === cat) : null;

  return (
    <>
      <FilterBar q={q} setQ={setQ} cat={cat} setCat={setCat} />
      <p className="sr-only" aria-live="polite">
        {results ? `${results.length} tools found` : ""}
      </p>
      {results ? (
        <section className="mt-10">
          <h2 className="font-sans text-lg font-semibold tracking-normal text-ink">
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </h2>
          {results.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border-strong p-10 text-center">
              <p className="font-medium text-ink">No tools match that search.</p>
              <p className="mt-1 text-sm text-muted">Try a broader word such as “image”, “pdf” or “calculator”.</p>
              <button type="button" onClick={() => setQ("")} className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:opacity-90">
                Show all tools
              </button>
            </div>
          )}
        </section>
      ) : (
        <ToolGroups only={cat} />
      )}
    </>
  );
}
