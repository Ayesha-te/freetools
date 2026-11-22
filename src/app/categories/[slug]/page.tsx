import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { categories, categoryMap, categoryHref, toolsInCategory, toolHref, type CategorySlug } from "@/lib/tools/registry";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { absUrl, pageMeta } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryMap[slug];
  if (!c) return {};
  return pageMeta({ title: c.title, description: c.metaDescription, path: categoryHref(slug) });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryMap[slug];
  if (!c) notFound();
  const list = toolsInCategory(slug as CategorySlug);
  const others = categories.filter((x) => x.slug !== slug);
  const url = absUrl(categoryHref(slug));

  return (
    <div className={`tone-${c.slug}`}>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
          <Breadcrumbs items={[{ name: c.name, href: categoryHref(slug) }]} />
          <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tone-soft text-tone">
              <ToolIcon name={c.icon} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-tone">{list.length} free tools</p>
              <h1 className="mt-1 text-4xl font-extrabold text-ink sm:text-5xl">{c.name}</h1>
            </div>
          </header>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-2">{c.intro[0]}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <AdSlot placement="content" />

        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="prose-content min-w-0 max-w-3xl">
            <h2>About our {c.name.toLowerCase()}</h2>
            {c.intro.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h2>Which tool should I use?</h2>
            <ul>
              {list.map((t) => (
                <li key={t.slug}>
                  <Link href={toolHref(t.slug)}>{t.name}</Link>: {t.summary}
                </li>
              ))}
            </ul>
          </section>

          <aside aria-labelledby="other-cats">
            <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
              <h2 id="other-cats" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                Other categories
              </h2>
              <ul className="mt-3 space-y-1">
                {others.map((o) => (
                  <li key={o.slug} className={`tone-${o.slug}`}>
                    <Link href={categoryHref(o.slug)} className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tone-soft text-tone">
                        <ToolIcon name={o.icon} className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{o.name}</span>
                      <ArrowRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          name: c.name,
          description: c.metaDescription,
          url,
          inLanguage: "en",
          isPartOf: { "@id": absUrl("/") + "#website" },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: list.length,
            itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absUrl(toolHref(t.slug)) })),
          },
        }}
      />
    </div>
  );
}
