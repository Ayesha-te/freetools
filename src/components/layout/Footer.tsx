import Link from "next/link";
import { categories, categoryHref, tools, toolHref } from "@/lib/tools/registry";
import { site } from "@/lib/site";
import CookieSettingsButton from "@/components/layout/CookieSettingsButton";
import BrandMark from "@/components/BrandMark";

const heading = "text-xs font-semibold uppercase tracking-[0.14em] text-muted";
const link = "text-ink-2 transition-colors hover:text-primary";

export default function Footer() {
  const popular = tools.filter((t) => t.popular).slice(0, 6);
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="ToolSprint home">
            <BrandMark className="h-8 w-8" />
            <span className="font-display text-lg font-bold tracking-tight">ToolSprint</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            {tools.length} free tools for images, PDFs, study maths, pricing, code and writing. Image and PDF tools run on your own device, so your files are never uploaded.
          </p>
        </div>
        <nav aria-label="Categories">
          <p className={heading}>Categories</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className={link}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Popular tools">
          <p className={heading}>Popular</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link href={toolHref(t.slug)} className={link}>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className={heading}>Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["About us", "/about/"],
              ["Contact", "/contact/"],
              ["FAQ", "/faq/"],
              ["Privacy policy", "/privacy-policy/"],
              ["Terms of service", "/terms/"],
              ["Disclaimer", "/disclaimer/"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className={link}>
                  {l}
                </Link>
              </li>
            ))}
            <CookieSettingsButton />
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">Made for quick jobs. No sign-up, ever.</p>
        </div>
      </div>
    </footer>
  );
}
