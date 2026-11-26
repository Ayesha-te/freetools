import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories, categoryHref, tools, toolsInCategory, toolHref } from "@/lib/tools/registry";
import { site, absUrl, pageMeta } from "@/lib/site";
import SearchBox from "@/components/layout/SearchBox";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import PersonalTools from "@/components/PersonalTools";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";

export const metadata: Metadata = pageMeta({
  title: `Free Online Tools for Images, PDFs & Calculators | ${site.name}`,
  description: site.description,
  path: "/",
  absolute: true,
});

const quickPicks = ["image-compressor", "pdf-merger", "gpa-calculator", "json-formatter", "word-counter"];

const steps = [
  ["Pick a tool", "Search by what you want to do, like “shrink photo” or “merge PDF”, or browse a category."],
  ["Add your file or numbers", "Drop a file in or type your values. Image and PDF work happens inside your browser tab."],
  ["Copy or download", "Get the result straight away. Calculators show the formula they used, so you can check it."],
];

const principles = [
  ["Your files stay on your device", "Image and PDF tools use your browser's own engines. Nothing is uploaded, so ID scans, contracts and bank statements stay private."],
  ["Honest results", "If a photo can't reach 50 KB or a PDF won't get smaller, the tool says so and shows the real size."],
  ["Formulas you can check", "Every calculator shows its working with your own numbers, so you can check the answer or learn the method."],
  ["No sign-up walls", "Every tool works the moment the page loads. Favourites are kept only in your own browser."],
];

const homeFaq = [
  { q: "Is ToolSprint really free?", a: "Yes. All tools are free with no account, no daily limit and no watermark on your files." },
  { q: "Are my files uploaded anywhere?", a: "No. Image, PDF, text and developer tools run in your browser on your own device, so your files never reach our servers." },
  { q: "Do the tools work on a phone?", a: "Yes. Every tool works in current mobile browsers on Android and iPhone. Very large PDFs may be slower on older phones because the work happens on the device." },
  { q: "How accurate are the calculators?", a: "They use standard formulas, are covered by automated tests and show their working. For official grades or tax figures, confirm the result with your school or tax authority." },
];

export default function Home() {
  const popular = tools.filter((t) => t.popular);
  const picks = quickPicks.map((s) => tools.find((t) => t.slug === s)).filter((t): t is (typeof tools)[number] => !!t);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-2 shadow-card">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {tools.length} free tools · no sign-up · no uploads
            </p>
            <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.04] text-ink sm:text-[3.4rem] lg:text-[3.6rem] xl:text-[4rem]">
              Free online tools for{" "}
              <span className="relative whitespace-nowrap text-primary">
                files & figures
                <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary/35" aria-hidden>
                  <path d="M2 9c60-6 140-8 296-4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              , right in your browser.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              Compress images, merge PDFs, work out your GPA, price products and tidy up code. Each tool opens instantly, works on any device and keeps your files on your device.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBox large />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 text-muted">Popular:</span>
              {picks.map((t) => (
                <Link
                  key={t.slug}
                  href={toolHref(t.slug)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-ink-2 transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Category board */}
          <nav aria-label="Tool categories" className="hidden lg:col-span-5 lg:block">
            <div className="grid grid-cols-2 gap-3 rounded-[1.75rem] border border-border bg-surface/70 p-3 shadow-pop backdrop-blur">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={categoryHref(c.slug)}
                  className={`tone-${c.slug} group flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-border-strong`}
                >
                  <span className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-tone-soft text-tone">
                      <ToolIcon name={c.icon} className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-ink" aria-hidden />
                  </span>
                  <span className="mt-6">
                    <span className="block font-semibold text-ink">{c.name.replace(" Tools", "")}</span>
                    <span className="mt-0.5 block font-mono text-xs text-muted">{toolsInCategory(c.slug).length} tools</span>
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <PersonalTools />

        {/* Popular */}
        <section className="mt-16" aria-labelledby="pop-h">
          <SectionHead id="pop-h" eyebrow="Most used" title="Popular tools" link={{ href: "/tools/", label: `All ${tools.length} tools` }} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        <AdSlot placement="home" />

        {/* Categories, with every tool listed so visitors and crawlers reach all of them from the home page */}
        <section className="mt-20" aria-labelledby="cat-h">
          <SectionHead id="cat-h" eyebrow="Browse" title="Every tool, by category" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const list = toolsInCategory(c.slug);
              return (
                <div key={c.slug} className={`tone-${c.slug} flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tone-soft text-tone">
                      <ToolIcon name={c.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-base font-semibold tracking-normal text-ink">
                        <Link href={categoryHref(c.slug)} className="hover:underline hover:underline-offset-4">
                          {c.name}
                        </Link>
                      </h3>
                      <p className="truncate text-sm text-muted">{c.short}</p>
                    </div>
                  </div>
                  <ul className="mt-4 flex-1 space-y-0.5 border-t border-border pt-3">
                    {list.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={toolHref(t.slug)}
                          className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                        >
                          <span className="truncate">{t.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-tone opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={categoryHref(c.slug)} className="mt-3 inline-flex items-center gap-1 px-2 text-sm font-medium text-tone hover:underline hover:underline-offset-4">
                    Open {c.name.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20" aria-labelledby="how-h">
          <SectionHead id="how-h" eyebrow="How it works" title="Three steps, no account" />
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {steps.map(([h, p], i) => (
              <li key={h} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <span className="font-mono text-sm font-semibold text-primary">0{i + 1}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold tracking-tight text-ink">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Principles */}
        <section className="mt-20 overflow-hidden rounded-[1.75rem] bg-ink text-bg" aria-labelledby="why-h">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bg/60">Why ToolSprint</p>
              <h2 id="why-h" className="mt-3 text-3xl font-bold text-bg sm:text-4xl">
                Private by design. Honest about the results.
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-bg/70">Quick jobs should get quick, trustworthy tools, with no upload queue, no paywall and no fake success messages.</p>
            </div>
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-3">
              {principles.map(([h, p]) => (
                <div key={h} className="border-t border-bg/15 pt-5">
                  <h3 className="font-sans text-base font-semibold tracking-normal text-bg">{h}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bg/70">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20 grid gap-8 lg:grid-cols-5" aria-labelledby="faq-h">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">FAQ</p>
            <h2 id="faq-h" className="mt-2 text-3xl font-bold text-ink">Common questions</h2>
            <p className="mt-3 max-w-sm text-ink-2">
              Something else on your mind? See the{" "}
              <Link href="/faq/" className="font-medium text-primary underline underline-offset-4">
                full FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact/" className="font-medium text-primary underline underline-offset-4">
                get in touch
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-3">
            <FaqList items={homeFaq} />
          </div>
        </section>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": absUrl("/") + "#website",
          name: site.name,
          alternateName: "ToolSprint Free Online Tools",
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
          logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
          slogan: site.tagline,
          description: site.description,
          ...(site.contactEmail ? { email: site.contactEmail } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Popular ToolSprint tools",
          itemListElement: popular.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absUrl(toolHref(t.slug)) })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}

function SectionHead({ id, eyebrow, title, link }: { id: string; eyebrow: string; title: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-3xl font-bold text-ink">
          {title}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30 sm:inline-flex">
          {link.label} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
