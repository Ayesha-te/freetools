"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { categories, categoryHref, searchTools, toolsInCategory } from "@/lib/tools/registry";
import ToolCard from "./ToolCard";
import { track } from "@/lib/analytics";

export default function AllToolsBrowser() {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  useEffect(() => {
    const initial = params.get("q");
    if (initial) setQ(initial.slice(0, 100));
  }, [params]);

  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => track("search", { query_length: q.length }), 800);
    return () => clearTimeout(t);
  }, [q]);

  const results = q.trim() ? searchTools(q) : null;

  return (
    <>
      <div className="relative mt-6 max-w-xl">
        <label htmlFor="filter" className="sr-only">Filter tools</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input id="filter" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter tools…" className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-9 pr-3 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
      </div>
      <p className="sr-only" aria-live="polite">{results ? `${results.length} tools found` : ""}</p>
      {results ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</h2>
          {results.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{results.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
          ) : (
            <p className="mt-3 text-ink-2">No tools match. Try a broader word such as “image”, “pdf” or “calculator”.</p>
          )}
        </section>
      ) : (
        categories.map((c) => (
          <section key={c.slug} className="mt-10" aria-labelledby={`all-${c.slug}`}>
            <h2 id={`all-${c.slug}`} className="text-xl font-bold text-ink">
              <Link href={categoryHref(c.slug)} className="hover:text-primary">{c.name}</Link>
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{toolsInCategory(c.slug).map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
          </section>
        ))
      )}
    </>
  );
}
