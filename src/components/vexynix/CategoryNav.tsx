"use client";

/**
 * Vexynix category tab bar (handoff section 7.3) — only catalog-backed
 * categories, each with its real count (section 15.1).
 */
import { CATEGORY_ORDER } from "./data";
import { categoryCount, providerOptions } from "./catalog";
import { useEffect, useState } from "react";

interface CategoryNavProps {
  active: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryNav({ active, onChange }: CategoryNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const tabs = [
    { key: null, label: "Semua Game", icon: "fa-solid fa-table-cells-large" },
    ...CATEGORY_ORDER.map((c) => ({ key: c.key, label: c.label, icon: c.icon })),
  ];

  useEffect(() => {
    if (!moreOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moreOpen]);

  return (
    <div className="vx-cat-tabs-shell">
      <nav className="vx-cat-tabs" aria-label="Kategori game">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key ?? "all"}
              type="button"
              className={`vx-cat-tab${isActive ? " is-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onChange(tab.key)}
            >
              <i className={tab.icon} aria-hidden="true" />
              {tab.label}
              <span className="vx-cat-tab-count">{categoryCount(tab.key)}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`vx-cat-tab${moreOpen ? " is-open" : ""}`}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <i className="fa-solid fa-ellipsis" aria-hidden="true" />
          Lainnya
        </button>
      </nav>
      {moreOpen && (
        <div className="vx-cat-more-menu" role="menu">
          {providerOptions().map((provider) => (
            <a
              key={provider.id}
              href={`/games?provider=${provider.id}`}
              role="menuitem"
              onClick={() => setMoreOpen(false)}
            >
              <span>{provider.name}</span>
              <small>{provider.count}</small>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
