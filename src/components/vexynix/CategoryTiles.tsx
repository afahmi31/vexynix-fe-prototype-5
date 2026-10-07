"use client";

/**
 * Vexynix category feature tiles (handoff section 6.8) — categories and counts
 * derive from the catalog (section 15.1); the grid adapts to the real number
 * of categories instead of the reference's eight.
 */
import { categoriesWithCounts } from "./data";

const TILE_THEMES = ["purple", "violet", "teal", "blue", "cyan", "green"] as const;

export default function CategoryTiles() {
  const categories = categoriesWithCounts();

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <h2 className="vx-section-title">
          <i className="fa-solid fa-shapes" aria-hidden="true" />
          Jelajahi Kategori
        </h2>
      </div>
      <div className="vx-cat-grid">
        {categories.map((cat, index) => (
          <a
            key={cat.key}
            href={`/games?cat=${cat.key}`}
            className={`vx-cat-tile vx-cat-tile--${TILE_THEMES[index % TILE_THEMES.length]}`}
          >
            <i className={cat.icon} aria-hidden="true" />
            <strong>{cat.label}</strong>
            <span>{cat.count} Game</span>
          </a>
        ))}
      </div>
    </section>
  );
}
