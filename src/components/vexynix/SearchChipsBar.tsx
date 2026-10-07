"use client";

/**
 * Vexynix search + quick category chips (handoff section 6.5). Chips deep-link
 * into the catalog with catalog-backed filters only (section 15.1); they scroll
 * horizontally with trailing padding so the last chip never looks clipped.
 */
import { categoriesWithCounts } from "./data";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const CHIP_ICONS: Record<string, string> = {
  popular: "fa-solid fa-fire",
  new: "fa-solid fa-wand-magic-sparkles",
};

export default function SearchChipsBar() {
  const router = useRouter();
  const categories = categoriesWithCounts();
  const [query, setQuery] = useState("");

  const navigateSearch = (value: string) => {
    const trimmed = value.trim();
    router.push(trimmed ? `/games?q=${encodeURIComponent(trimmed)}` : "/games");
  };

  const chips = [
    { key: "popular", label: "Populer", icon: CHIP_ICONS.popular, href: "/games?sort=popular" },
    { key: "new", label: "Rilis Baru", icon: CHIP_ICONS.new, href: "/games?sort=new" },
    ...categories.map((c) => ({
      key: `cat:${c.key}`,
      label: c.label,
      icon: c.icon,
      href: `/games?cat=${c.key}`,
    })),
  ];

  return (
    <div className="vx-search-row" role="search">
      <form
        className="vx-search-field"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          navigateSearch(typeof value === "string" ? value : query);
        }}
      >
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          name="q"
          placeholder="Cari game, provider, atau fitur…"
          aria-label="Cari game"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              navigateSearch(event.currentTarget.value);
            }
          }}
        />
        <button type="submit" className="vx-search-submit" aria-label="Cari">
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </form>
      <div className="vx-chips" aria-label="Filter cepat">
        {chips.map((chip) => (
          <a key={chip.key} href={chip.href} className="vx-chip">
            <i className={chip.icon} aria-hidden="true" />
            {chip.label}
          </a>
        ))}
      </div>
      <a href="/games" className="vx-chip-next" aria-label="Lihat semua game">
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </a>
    </div>
  );
}
