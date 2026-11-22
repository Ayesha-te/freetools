import Link from "next/link";
import { categories, categoryHref, tools, toolHref } from "@/lib/tools/registry";
import { site } from "@/lib/site";

export default function Footer() {
  const popular = tools.filter((t) => t.popular).slice(0, 6);
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-ink">
            FreeTools<span className="text-primary">Hub</span>
          </p>
          <p className="mt-2 text-sm text-muted">{site.tagline}</p>
          <p className="mt-3 text-sm text-muted">Free browser-based tools. Most processing happens on your own device.</p>
        </div>
        <nav aria-label="Categories">
          <p className="text-sm font-semibold text-ink">Categories</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className="text-muted hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Popular tools">
          <p className="text-sm font-semibold text-ink">Popular tools</p>
          <ul className="mt-3 space-y-2 text-sm">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link href={toolHref(t.slug)} className="text-muted hover:text-primary">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="text-sm font-semibold text-ink">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["About Us", "/about/"],
              ["Contact", "/contact/"],
              ["FAQ", "/faq/"],
              ["Privacy Policy", "/privacy-policy/"],
              ["Terms of Service", "/terms/"],
              ["Disclaimer", "/disclaimer/"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-muted hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
