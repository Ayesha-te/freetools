import type { ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AdSlot from "@/components/AdSlot";

export default function InfoPage({ title, href, intro, children, updated, ads = false }: { title: string; href: string; intro?: string; children: ReactNode; updated?: string; ads?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
      <Breadcrumbs items={[{ name: title, href }]} />
      <header className="mt-8 border-b border-border pb-8">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 text-lg leading-relaxed text-ink-2">{intro}</p>}
        {updated && <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted">Last updated · {updated}</p>}
      </header>
      <div className="prose-content mt-10">{children}</div>
      {ads && <AdSlot placement="content" />}
    </div>
  );
}
