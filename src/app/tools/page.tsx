import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { Suspense } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AllToolsBrowser from "@/components/AllToolsBrowser";
import { tools } from "@/lib/tools/registry";

export const metadata: Metadata = pageMeta({
  title: "All Free Online Tools – Image, PDF, Calculators, Developer & SEO",
  description: `Browse all ${tools.length} free ToolSprint tools by category: image compression, PDF editing, GPA and business calculators, developer utilities and text/SEO tools.`,
  path: "/tools/",
});

export default function AllToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "All Tools", href: "/tools/" }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">All tools</h1>
      <p className="mt-2 max-w-2xl text-ink-2">
        Every tool on ToolSprint, grouped by category. Use the filter to find what you need, or star tools to save them to your favourites on this device.
      </p>
      <Suspense fallback={null}>
        <AllToolsBrowser />
      </Suspense>
    </div>
  );
}
