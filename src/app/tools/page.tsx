import type { Metadata } from "next";
import { Suspense } from "react";
import { absUrl, pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AllToolsBrowser, { FilterBar, ToolGroups } from "@/components/AllToolsBrowser";
import JsonLd from "@/components/JsonLd";
import { tools, toolHref, categories } from "@/lib/tools/registry";

export const metadata: Metadata = pageMeta({
  title: "All Free Online Tools – Image, PDF, Calculators, Developer & SEO",
  description: `Browse all ${tools.length} free ToolSprint tools by category: image compression, PDF editing, GPA and business calculators, developer utilities and text/SEO tools.`,
  path: "/tools/",
});

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "All Tools", href: "/tools/" }]} />
      <header className="mt-8 max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">
          {tools.length} tools · {categories.length} categories
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-ink sm:text-5xl">All free online tools</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Every tool on ToolSprint in one place. Filter by name or category, and tap the star on any card to keep it in your favourites on this device.
        </p>
      </header>
      {/* The fallback is the full, server-rendered list, so crawlers and no-JS visitors see every tool link. */}
      <Suspense
        fallback={
          <>
            <FilterBar q="" cat={null} />
            <ToolGroups />
          </>
        }
      >
        <AllToolsBrowser />
      </Suspense>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": absUrl("/tools/") + "#page",
          name: "All free online tools",
          url: absUrl("/tools/"),
          inLanguage: "en",
          isPartOf: { "@id": absUrl("/") + "#website" },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: tools.length,
            itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absUrl(toolHref(t.slug)) })),
          },
        }}
      />
    </div>
  );
}
