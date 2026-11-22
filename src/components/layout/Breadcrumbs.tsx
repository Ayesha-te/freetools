import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-2">
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className="transition-colors hover:text-ink">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(it.href) })),
        }}
      />
    </>
  );
}
