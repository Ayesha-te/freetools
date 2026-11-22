"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/lib/storage";
import { cx } from "./ui";

export default function FavoriteButton({ slug, name, small = false }: { slug: string; name: string; small?: boolean }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={fav ? "Remove from favorites" : "Add to favorites"}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors",
        small ? "h-9 w-9 text-muted hover:bg-surface-2 hover:text-ink" : "min-h-10 border border-border-strong bg-surface px-4 text-ink-2 hover:bg-surface-2",
        fav && "text-amber-500",
      )}
    >
      <Star className={cx("h-4 w-4", fav && "fill-current")} aria-hidden />
      {!small && (fav ? "Saved" : "Save")}
    </button>
  );
}
