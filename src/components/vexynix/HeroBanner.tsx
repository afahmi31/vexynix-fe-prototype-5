"use client";

/**
 * Vexynix hero banner (handoff section 6.3). Brand lines stay in English as
 * product identity; supporting copy is Indonesian (AGENTS.md UI language rule).
 * Counts in the stats strip derive from the catalog (section 15.1).
 */
import { totalGames, totalProviders } from "./data";

export default function HeroBanner() {
  const stats = [
    { icon: "fa-solid fa-bolt", label: "Instan Tanpa Unduh" },
    { icon: "fa-solid fa-dice", label: `${totalGames()} Game` },
    { icon: "fa-solid fa-shield-halved", label: "Aman & Fair" },
    { icon: "fa-solid fa-mobile-screen", label: `Main di Mana Saja` },
  ];

  return (
    <section className="vx-hero" aria-label="Sambutan">
      <div className="vx-hero-copy">
        <h1 className="vx-hero-title">
          GOOD GAMES
          <em>BRIGHTER DAYS</em>
        </h1>
        <p className="vx-hero-sub">
          Putar, main, dan jadikan setiap momen berharga. Kemenangan besarmu hanya satu klik lagi —{" "}
          {totalProviders()} provider pilihan menantimu.
        </p>
        <div className="vx-hero-ctas">
          <a href="/games?sort=popular" className="vx-btn vx-btn--gold">
            Main Sekarang
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
          <a href="/games" className="vx-btn vx-btn--ghost">
            Jelajahi Game
          </a>
        </div>
      </div>

      <ul className="vx-hero-stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <i className={stat.icon} aria-hidden="true" />
            {stat.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
