import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, Zap, Gift, ArrowRight } from "lucide-react";
import { categories, categoryHref, tools, toolsInCategory } from "@/lib/tools/registry";
import { site, absUrl, pageMeta } from "@/lib/site";
import SearchBox from "@/components/layout/SearchBox";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import PersonalTools from "@/components/PersonalTools";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: `${site.name} – Free Online Tools for Images, PDFs, Students & Developers`,
  description: site.description,
  path: "/",
  absolute: true,
});

export default function Home() {
  const popular = tools.filter((t) => t.popular);
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{site.tagline}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-5xl">Free online tools that work right in your browser</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">
            Compress images, merge PDFs, calculate your GPA, price products and format code — {tools.length} carefully built tools, no sign-up, with your files kept on your own device.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBox large />
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-2">
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" aria-hidden /> Files processed locally</li>
            <li className="flex items-center gap-1.5"><Gift className="h-4 w-4 text-primary" aria-hidden /> Free, no account needed</li>
            <li className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" aria-hidden /> Fast on any device</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <PersonalTools />

        <section className="mt-12" aria-labelledby="cat-h">
          <h2 id="cat-h" className="text-2xl font-bold tracking-tight text-ink">Browse by category</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.slug} href={categoryHref(c.slug)} className="group flex gap-4 rounded-xl border border-border bg-surface p-5 transition-shadow hover:border-primary/40 hover:shadow-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <ToolIcon name={c.icon} className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-semibold text-ink">
                    {c.name} <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm text-muted">{c.short}</span>
                  <span className="mt-2 block text-xs font-medium text-primary">{toolsInCategory(c.slug).length} tools</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="pop-h">
          <div className="flex items-end justify-between gap-4">
            <h2 id="pop-h" className="text-2xl font-bold tracking-tight text-ink">Popular tools</h2>
            <Link href="/tools/" className="text-sm font-medium text-primary hover:underline">View all {tools.length} tools →</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>

        <AdSlot placement="home" />

        <section className="mt-14 grid gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-10 lg:grid-cols-3" aria-labelledby="why-h">
          <div className="lg:col-span-1">
            <h2 id="why-h" className="text-2xl font-bold tracking-tight text-ink">Built for privacy and honesty</h2>
            <p className="mt-3 text-ink-2">We think simple tasks deserve simple, trustworthy tools.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {[
              ["Your files stay with you", "Image and PDF tools run on your device using your browser's own engines. Nothing is uploaded, so private documents stay private."],
              ["Honest results", "If an image can't reach 50 KB or a PDF can't be compressed further, we tell you, instead of showing a misleading success message."],
              ["Formulas you can check", "Every calculator explains the formula it used with your own numbers, so you can verify the answer or learn the method."],
              ["No sign-up walls", "Every tool works immediately. Favourites and recently used tools are remembered only in your own browser."],
            ].map(([h, p]) => (
              <div key={h}>
                <h3 className="font-semibold text-ink">{h}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {categories.map((c) => (
          <section key={c.slug} className="mt-14" aria-labelledby={`h-${c.slug}`}>
            <div className="flex items-end justify-between gap-4">
              <h2 id={`h-${c.slug}`} className="text-xl font-bold text-ink">{c.name}</h2>
              <Link href={categoryHref(c.slug)} className="text-sm font-medium text-primary hover:underline">All {c.name.toLowerCase()} →</Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {toolsInCategory(c.slug).slice(0, 4).map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": absUrl("/") + "#website",
          name: site.name,
          url: absUrl("/"),
          description: site.description,
          inLanguage: "en",
          publisher: { "@id": absUrl("/") + "#organization" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": absUrl("/") + "#organization",
          name: site.name,
          url: absUrl("/"),
          logo: `${site.url}/logo.png`,
          slogan: site.tagline,
          ...(site.contactEmail ? { email: site.contactEmail } : {}),
        }}
      />
    </>
  );
}
