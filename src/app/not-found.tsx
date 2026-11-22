import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { tools, toolHref } from "@/lib/tools/registry";
import SearchBox from "@/components/layout/SearchBox";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-sm font-semibold text-primary">Error 404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-ink sm:text-5xl">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-lg text-ink-2">The link may be broken or the page may have moved. Search for the tool you need:</p>
        <div className="mx-auto mt-8 max-w-lg text-left">
          <SearchBox large />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {tools
            .filter((t) => t.popular)
            .slice(0, 6)
            .map((t) => (
              <Link key={t.slug} href={toolHref(t.slug)} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-ink/30 hover:text-ink">
                {t.name}
              </Link>
            ))}
        </div>
        <Link href="/" className="mt-12 inline-flex items-center gap-1.5 font-medium text-ink hover:underline hover:underline-offset-4">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
        </Link>
      </div>
    </div>
  );
}
