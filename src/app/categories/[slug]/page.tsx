import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryMap, categoryHref, toolsInCategory, toolHref, type CategorySlug } from "@/lib/tools/registry";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/ToolCard";
import ToolIcon from "@/components/ToolIcon";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { ogImages, absUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryMap[slug];
  if (!c) return {};
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: categoryHref(slug) },
    openGraph: { title: c.title, description: c.metaDescription, url: categoryHref(slug) , images: ogImages },
    twitter: { title: c.title, description: c.metaDescription },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryMap[slug];
  if (!c) notFound();
  const list = toolsInCategory(slug as CategorySlug);
  const others = categories.filter((x) => x.slug !== slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: c.name, href: categoryHref(slug) }]} />
      <header className="mt-5 flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:flex">
          <ToolIcon name={c.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">{c.name}</h1>
          <p className="mt-2 max-w-3xl text-ink-2">{c.intro[0]}</p>
        </div>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>

      <AdSlot placement="content" />

      <section className="prose-content mt-14 max-w-3xl">
        <h2>About our {c.name.toLowerCase()}</h2>
        {c.intro.slice(1).map((p, i) => <p key={i}>{p}</p>)}
        <h2>Which tool should I use?</h2>
        <ul>
          {list.map((t) => (
            <li key={t.slug}>
              <Link href={toolHref(t.slug)}>{t.name}</Link> — {t.summary}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="other-cats">
        <h2 id="other-cats" className="text-xl font-bold text-ink">Other categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => (
            <Link key={o.slug} href={categoryHref(o.slug)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-2 hover:border-primary/40 hover:text-primary">
              <ToolIcon name={o.icon} className="h-4 w-4" /> {o.name}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.name,
          description: c.metaDescription,
          url: absUrl(categoryHref(slug)),
          hasPart: list.map((t) => ({ "@type": "WebApplication", name: t.name, url: absUrl(toolHref(t.slug)) })),
        }}
      />
    </div>
  );
}
