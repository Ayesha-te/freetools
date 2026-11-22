import Link from "next/link";
import type { ToolMeta } from "@/lib/tools/registry";
import { toolHref } from "@/lib/tools/registry";
import ToolIcon from "./ToolIcon";
import FavoriteButton from "./FavoriteButton";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-border bg-surface p-4 transition-shadow hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="relative z-10">
          <FavoriteButton slug={tool.slug} name={tool.name} small />
        </div>
      </div>
      <h3 className="mt-3 font-semibold text-ink">
        <Link href={toolHref(tool.slug)} className="after:absolute after:inset-0 after:rounded-xl focus:outline-none">
          {tool.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{tool.summary}</p>
    </div>
  );
}
