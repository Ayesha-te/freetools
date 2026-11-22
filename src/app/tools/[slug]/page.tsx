import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Zap, BadgeCheck, ArrowRight } from "lucide-react";
import { tools, toolMap, categoryMap, toolHref, categoryHref } from "@/lib/tools/registry";
import { content } from "@/content";
import { absUrl, site, pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolRenderer from "@/components/tools/ToolRenderer";
import ToolCard from "@/components/ToolCard";
import FavoriteButton from "@/components/FavoriteButton";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import ToolIcon from "@/components/ToolIcon";
import FaqList from "@/components/FaqList";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = toolMap[slug];
  if (!t) return {};
  return pageMeta({ title: t.title, description: t.metaDescription, path: toolHref(slug) });
}

/** Local file tools never upload; calculators and text tools also run fully in the browser. */
function trustChips(category: string) {
  const local = category === "image" || category === "pdf" ? "Files never leave your device" : "Runs in your browser";
  return [
    { Icon: ShieldCheck, label: local },
    { Icon: BadgeCheck, label: "Free, no sign-up" },
    { Icon: Zap, label: "Works on mobile" },
  ];
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolMap[slug];
  const c = content[slug];
  if (!tool || !c) notFound();
  const cat = categoryMap[tool.category];
  const related = c.related.map((s) => toolMap[s]).filter(Boolean);
  const url = absUrl(toolHref(slug));

  const sections = [
    { id: "what", label: `What it is` },
    ...(c.audience.length ? [{ id: "who", label: "Who it's for" }] : []),
    ...(c.features.length ? [{ id: "features", label: "Key features" }] : []),
    { id: "how", label: "How to use it" },
    { id: "examples", label: "Examples" },
    { id: "formats", label: "Formats & inputs" },
    { id: "limits", label: "Limitations" },
    { id: "privacy", label: "Privacy" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className={`tone-${tool.category}`}>
      {/* Tool header + workspace */}
      <div className="border-b border-border bg-surface/60">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
          <Breadcrumbs items={[{ name: cat.name, href: categoryHref(cat.slug) }, { name: tool.name, href: toolHref(slug) }]} />

          <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tone-soft text-tone sm:h-14 sm:w-14">
                <ToolIcon name={tool.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div className="min-w-0">
                <h1 className="text-[1.75rem] font-bold leading-tight text-ink sm:text-4xl">{tool.name}</h1>
                <p className="mt-1.5 max-w-2xl text-ink-2 sm:text-lg">{tool.summary}</p>
              </div>
            </div>
            <div className="shrink-0">
              <FavoriteButton slug={slug} name={tool.name} />
            </div>
          </header>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="About this tool">
            {trustChips(tool.category).map(({ Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-2">
                <Icon className="h-3.5 w-3.5 text-success" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <ToolRenderer slug={slug} />
          </div>

          <p className="mt-4 flex items-start gap-2 text-sm text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <span>{c.privacy}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AdSlot placement="tool" />

        {/* Guide */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <article className="prose-content min-w-0 max-w-3xl">
            <h2 id="what">What is the {tool.name}?</h2>
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {c.audience.length > 0 && (
              <>
                <h2 id="who">Who is the {tool.name} for?</h2>
                <ul>
                  {c.audience.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            )}

            {c.features.length > 0 && (
              <>
                <h2 id="features">Key features</h2>
                <ul>
                  {c.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <h3>Why use it?</h3>
            {c.why.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <h2 id="how">How to use the {tool.name}</h2>
            <ol>
              {c.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>

            <h2 id="examples">Examples</h2>
            <div className="not-prose mt-4 grid gap-3">
              {c.examples.map((e, i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="font-sans text-base font-semibold tracking-normal text-ink">{e.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-2">{e.body}</p>
                </div>
              ))}
            </div>

            <h2 id="formats">Supported formats and inputs</h2>
            <ul>
              {c.formats.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h2 id="limits">Limitations to know about</h2>
            <ul>
              {c.limitations.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h2 id="privacy">Privacy</h2>
            <p>{c.privacy}</p>

            <h2 id="faq">Frequently asked questions</h2>
            <div className="mt-4">
              <FaqList items={c.faq} />
            </div>

            <p className="mt-8 text-sm text-muted">
              Last reviewed <time dateTime={site.lastUpdated}>{formatDate(site.lastUpdated)}</time> by the {site.name} team.
            </p>
          </article>

          <aside className="hidden lg:block" aria-label="On this page">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
              <ul className="mt-3 space-y-0.5 border-l border-border text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-ink-2 transition-colors hover:border-ink hover:text-ink">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#main" className="mt-4 inline-block pl-4 text-sm font-medium text-primary hover:underline hover:underline-offset-4">
                ↑ Back to the tool
              </a>
            </nav>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-heading" className="text-2xl font-bold text-ink">
                Related tools
              </h2>
              <Link href={categoryHref(cat.slug)} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink hover:underline hover:underline-offset-4">
                All {cat.name.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${url}#app`,
          name: tool.name,
          url,
          description: tool.metaDescription,
          applicationCategory: tool.category === "developer" ? "DeveloperApplication" : "UtilitiesApplication",
          operatingSystem: "Any (web browser)",
          browserRequirements: "Requires JavaScript and a current web browser",
          inLanguage: "en",
          isAccessibleForFree: true,
          dateModified: site.lastUpdated,
          ...(c.features.length ? { featureList: c.features } : {}),
          keywords: tool.keywords.join(", "),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@id": absUrl("/") + "#organization", "@type": "Organization", name: site.name, url: absUrl("/") },
          isPartOf: { "@id": absUrl("/") + "#website" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
