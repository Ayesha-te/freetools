"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Zap } from "lucide-react";
import SearchBox from "./SearchBox";
import { categories, categoryHref } from "@/lib/tools/registry";
import ToolIcon from "@/components/ToolIcon";

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
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2"
    >
      {dark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-ink" aria-label="ToolSprint home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <Zap className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-lg tracking-tight">
        Tool<span className="text-primary">Sprint</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          <Link href="/tools/" className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
            All Tools
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
              {c.name.replace(" Tools", "")}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-full max-w-xs md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
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
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-surface px-4 pb-8 pt-4 lg:hidden">
          <div className="md:hidden">
            <SearchBox onNavigate={() => setOpen(false)} />
          </div>
          <nav aria-label="Mobile" className="mt-4 grid gap-1">
            <Link href="/tools/" className="rounded-lg px-3 py-3 font-medium text-ink hover:bg-surface-2">
              All Tools
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} href={categoryHref(c.slug)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-ink-2 hover:bg-surface-2">
                <ToolIcon name={c.icon} className="h-5 w-5 text-primary" />
                {c.name}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            {[
              ["About", "/about/"],
              ["FAQ", "/faq/"],
              ["Contact", "/contact/"],
            ].map(([l, h]) => (
              <Link key={h} href={h} className="rounded-lg px-3 py-3 text-ink-2 hover:bg-surface-2">
                {l}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
