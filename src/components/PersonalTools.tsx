"use client";

import { useFavorites, useRecent } from "@/lib/storage";
import { toolMap } from "@/lib/tools/registry";
import ToolCard from "./ToolCard";

/** Favourites and recently used tools, stored only in this browser's localStorage. */
export default function PersonalTools() {
  const { favorites } = useFavorites();
  const { recent, clear } = useRecent();
  const favs = favorites.map((s) => toolMap[s]).filter(Boolean);
  const rec = recent.map((s) => toolMap[s]).filter(Boolean).slice(0, 4);
  if (!favs.length && !rec.length) return null;
  return (
    <div className="mt-10 space-y-10">
      {favs.length > 0 && (
        <section aria-labelledby="fav-h">
          <h2 id="fav-h" className="text-xl font-bold text-ink">Your favourites</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{favs.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>
      )}
      {rec.length > 0 && (
        <section aria-labelledby="rec-h">
          <div className="flex items-end justify-between">
            <h2 id="rec-h" className="text-xl font-bold text-ink">Recently used</h2>
            <button type="button" onClick={clear} className="text-sm text-muted hover:text-primary">Clear history</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rec.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>
      )}
    </div>
  );
}
