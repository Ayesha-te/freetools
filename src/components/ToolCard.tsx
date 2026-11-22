import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools/registry";
import { toolHref } from "@/lib/tools/registry";
import ToolIcon from "./ToolIcon";
import FavoriteButton from "./FavoriteButton";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <div
      className={`tone-${tool.category} group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-pop`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tone-soft text-tone">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="relative z-10 -mr-1.5 -mt-1.5">
          <FavoriteButton slug={tool.slug} name={tool.name} small />
        </div>
      </div>
      <h3 className="mt-4 flex items-center gap-1 font-sans text-[0.95rem] font-semibold tracking-normal text-ink">
        <Link href={toolHref(tool.slug)} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">
          {tool.name}
        </Link>
        <ArrowUpRight className="h-4 w-4 -translate-x-1 text-muted opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{tool.summary}</p>
    </div>
  );
}
