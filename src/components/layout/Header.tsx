"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";
import SearchBox from "./SearchBox";
import { categories, categoryHref, toolsInCategory } from "@/lib/tools/registry";
import ToolIcon from "@/components/ToolIcon";
import BrandMark from "@/components/BrandMark";
import { cx } from "@/components/ui";

function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("fth-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
    >
      {dark ? <Sun className="h-[18px] w-[18px]" aria-hidden /> : <Moon className="h-[18px] w-[18px]" aria-hidden />}
    </button>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="ToolSprint home">
      <BrandMark className="h-8 w-8" />
      <span className="font-display text-[1.15rem] font-bold tracking-tight">ToolSprint</span>
    </Link>
  );
}

const navLink = "rounded-full px-3 py-1.5 text-sm font-medium transition-colors";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const active = (href: string) => (href === "/tools/" ? pathname === href : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden items-center gap-0.5 lg:flex">
          <Link href="/tools/" className={cx(navLink, active("/tools/") ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink")}>
            All tools
          </Link>
          {categories.map((c, i) => {
            const href = categoryHref(c.slug);
            return (
              <Link
                key={c.slug}
                href={href}
                className={cx(navLink, i >= 4 && "hidden xl:inline-flex", active(href) ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink")}
              >
                {c.name.replace(" Tools", "")}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden w-full max-w-[17rem] md:block">
          <SearchBox shortcut />
        </div>
        <div className="ml-auto flex items-center gap-0.5 md:ml-1">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-bg px-4 pb-10 pt-4 lg:hidden">
          <div className="md:hidden">
            <SearchBox onNavigate={() => setOpen(false)} />
          </div>
          <nav aria-label="Mobile" className="mt-5">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Categories</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={categoryHref(c.slug)}
                  className={`tone-${c.slug} flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-3 text-ink hover:border-border-strong`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tone-soft text-tone">
                    <ToolIcon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{c.name}</span>
                    <span className="block text-xs text-muted">{toolsInCategory(c.slug).length} tools</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link href="/tools/" className="mt-3 flex items-center justify-between rounded-2xl bg-ink px-4 py-3.5 font-medium text-bg">
              Browse all tools <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 px-1 text-sm text-ink-2">
              {[
                ["About", "/about/"],
                ["FAQ", "/faq/"],
                ["Contact", "/contact/"],
              ].map(([l, h]) => (
                <Link key={h} href={h} className="py-1 hover:text-primary">
                  {l}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
