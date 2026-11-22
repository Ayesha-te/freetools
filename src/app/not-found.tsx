import Link from "next/link";
import type { Metadata } from "next";
import { tools, toolHref } from "@/lib/tools/registry";
import SearchBox from "@/components/layout/SearchBox";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">We couldn't find that page</h1>
      <p className="mt-3 text-ink-2">The link may be broken or the page may have moved. Try searching for the tool you need:</p>
      <div className="mx-auto mt-6 max-w-md text-left">
        <SearchBox />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {tools.filter((t) => t.popular).slice(0, 6).map((t) => (
          <Link key={t.slug} href={toolHref(t.slug)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-2 hover:border-primary/40 hover:text-primary">
            {t.name}
          </Link>
        ))}
      </div>
      <Link href="/" className="mt-10 inline-block font-medium text-primary hover:underline">← Back to home</Link>
    </div>
  );
}
