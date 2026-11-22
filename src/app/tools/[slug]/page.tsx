import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
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

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolMap[slug];
  const c = content[slug];
  if (!tool || !c) notFound();
  const cat = categoryMap[tool.category];
  const related = c.related.map((s) => toolMap[s]).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumbs items={[{ name: cat.name, href: categoryHref(cat.slug) }, { name: tool.name, href: toolHref(slug) }]} />

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:flex">
            <ToolIcon name={tool.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 text-ink-2">{tool.summary}</p>
          </div>
        </div>
        <FavoriteButton slug={slug} name={tool.name} />
      </header>

      <div className="mt-6">
        <ToolRenderer slug={slug} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
        <span>{c.privacy}</span>
      </p>

      <AdSlot placement="tool" />

      <article className="prose-content mt-12 max-w-3xl">
        <h2>What is the {tool.name}?</h2>
        {c.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {c.audience.length > 0 && (
          <>
            <h2>Who is the {tool.name} for?</h2>
            <ul>
              {c.audience.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </>
        )}

        {c.features.length > 0 && (
          <>
            <h2>Key features</h2>
            <ul>
              {c.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </>
        )}

        <h2>Why use it?</h2>
        {c.why.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h2>How to use the {tool.name}</h2>
        <ol>
          {c.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <h2>Examples</h2>
        {c.examples.map((e, i) => (
          <div key={i}>
            <h3>{e.title}</h3>
            <p>{e.body}</p>
          </div>
        ))}

        <h2>Supported formats and inputs</h2>
        <ul>
          {c.formats.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <h2>Limitations to know about</h2>
        <ul>
          {c.limitations.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <h2>Privacy</h2>
        <p>{c.privacy}</p>

        <h2>Frequently asked questions</h2>
        <div className="not-prose space-y-3">
          {c.faq.map((f, i) => (
            <details key={i} className="group rounded-lg border border-border bg-surface px-4 py-3">
              <summary className="cursor-pointer font-medium text-ink">{f.q}</summary>
              <p className="!mb-0">{f.a}</p>
            </details>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold text-ink">
            Related tools
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link href={categoryHref(cat.slug)} className="font-medium text-primary hover:underline">
              Browse all {cat.name.toLowerCase()} →
            </Link>
          </p>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url: absUrl(toolHref(slug)),
          description: tool.metaDescription,
          applicationCategory: tool.category === "developer" ? "DeveloperApplication" : "UtilitiesApplication",
          operatingSystem: "Any (web browser)",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
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
