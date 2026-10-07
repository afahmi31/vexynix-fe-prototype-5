"use client";

/**
 * Vexynix left navigation rail (handoff section 6.2). Categories derive from
 * the catalog (section 15.1) — no rail item points at an empty category.
 */
import { useVexynixShell } from "@/stores/vexynix-shell";
import { categoriesWithCounts } from "./data";
import { MOCK_CATALOG } from "@/mocks/prototype-mock";

const newReleaseCount = MOCK_CATALOG.filter((g) => g.is_new && g.status === "active").length;

export default function LeftNavRail() {
  const closeRail = useVexynixShell((s) => s.closeRail);
  const categories = categoriesWithCounts();

  return (
    <aside className="vx-rail" aria-label="Navigasi kategori">
      <a href="/lobby" className="vx-rail-item is-active" onClick={closeRail}>
        <i className="fa-solid fa-house" aria-hidden="true" />
        Beranda
      </a>

      {categories.map((cat) => (
        <a key={cat.key} href={`/games?cat=${cat.key}`} className="vx-rail-item" onClick={closeRail}>
          <i className={cat.icon} aria-hidden="true" />
          {cat.label}
        </a>
      ))}

      <div className="vx-rail-sep" />

      <a href="/games?sort=new" className="vx-rail-item" onClick={closeRail}>
        <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
        Rilis Baru
        {newReleaseCount > 0 && <span className="vx-rail-count">{newReleaseCount}</span>}
      </a>
      <a href="/games" className="vx-rail-item" onClick={closeRail}>
        <i className="fa-solid fa-puzzle-piece" aria-hidden="true" />
        Provider
      </a>

      <div className="vx-rail-promo">
        <strong>Main di Mana Saja</strong>
        <p>Satu akun untuk semua perangkat — lanjutkan permainanmu kapan saja.</p>
        <button type="button" className="vx-btn vx-btn--primary">
          Mulai
        </button>
      </div>
    </aside>
  );
}
