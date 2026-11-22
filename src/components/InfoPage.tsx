import type { ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AdSlot from "@/components/AdSlot";

export default function InfoPage({ title, href, intro, children, updated, ads = false }: { title: string; href: string; intro?: string; children: ReactNode; updated?: string; ads?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: title, href }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {updated && <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>}
      {intro && <p className="mt-4 text-lg text-ink-2">{intro}</p>}
      <div className="prose-content mt-6">{children}</div>
      {ads && <AdSlot placement="content" />}
    </div>
  );
}
