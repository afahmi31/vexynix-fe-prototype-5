"use client";

/**
 * Vexynix catalog hero (handoff section 7.2). Stats derive from the catalog
 * (section 15.1) — the "10,000+ Games" of the reference becomes the real count.
 */
import { totalGames, totalProviders } from "./data";

interface CatalogHeroProps {
  title: string;
  subtitle: string;
  query: string;
  onQueryChange: (value: string) => void;
}

export default function CatalogHero({ title, subtitle, query, onQueryChange }: CatalogHeroProps) {
  const stats = [
    { icon: "fa-solid fa-dice", value: `${totalGames()}`, label: "Total Game" },
    { icon: "fa-solid fa-puzzle-piece", value: `${totalProviders()}`, label: "Provider" },
    { icon: "fa-solid fa-bolt", value: "Instan", label: "Tanpa Unduh" },
    { icon: "fa-solid fa-shield-halved", value: "100% Aman", label: "Main Tenang" },
  ];

  return (
    <section className="vx-cat-hero" aria-label="Jelajahi game">
      <div className="vx-cat-hero-copy">
        <nav className="vx-breadcrumb" aria-label="Breadcrumb">
          <a href="/lobby">Beranda</a>
          <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          <span aria-current="page">Semua Game</span>
        </nav>

        <h1 className="vx-cat-hero-title">
          Jelajahi
          <em>{title}</em>
        </h1>
        <p className="vx-cat-hero-sub">{subtitle}</p>

        <div className="vx-cat-hero-search" role="search">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari game…"
            aria-label="Cari game"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>

      <ul className="vx-cat-stats" aria-label="Statistik katalog">
        {stats.map((stat) => (
          <li key={stat.label}>
            <span className="vx-cat-stat-icon">
              <i className={stat.icon} aria-hidden="true" />
            </span>
            <div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
