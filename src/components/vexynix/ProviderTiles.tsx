"use client";

/**
 * Vexynix top providers panel (handoff section 6.9). Provider list comes from
 * MOCK_VENDORS; logos fall back to a text treatment (section 15.3 — no logo
 * assets exist, and generated marks are last resort).
 */
import { MOCK_CATALOG, MOCK_VENDORS } from "@/mocks/prototype-mock";

function gameCount(vendorId: string): number {
  return MOCK_CATALOG.filter((g) => g.vendor_id === vendorId && g.status === "active").length;
}

export default function ProviderTiles() {
  return (
    <section className="vx-provider-card" aria-label="Provider utama">
      <div className="vx-section-head">
        <h3 className="vx-section-title" style={{ fontSize: "15px" }}>
          <i className="fa-solid fa-puzzle-piece" aria-hidden="true" />
          Provider Utama
        </h3>
        <a href="#" className="vx-section-see-all">
          Lihat Semua
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </a>
      </div>
      <div className="vx-provider-grid">
        {MOCK_VENDORS.slice(0, 6).map((vendor) => (
          <a key={vendor.id} href={`/games?provider=${vendor.id}`} className="vx-provider-tile">
            {vendor.name}
            <small style={{ fontWeight: 500, opacity: 0.7 }}> · {gameCount(vendor.id)}</small>
          </a>
        ))}
      </div>
    </section>
  );
}
