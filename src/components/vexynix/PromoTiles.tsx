"use client";

/**
 * Vexynix promo tiles (handoff section 6.4) — four reward tiles using the
 * existing decorative CTA artwork (asset priority rule, section 15.3).
 */
interface PromoTile {
  id: string;
  label: string;
  title: string;
  value: string;
  cta: string;
  tone: "green" | "purple" | "blue" | "gold";
  ctaVariant: "gold" | "primary";
  image: string;
}

const TILES: PromoTile[] = [
  {
    id: "welcome-bonus",
    label: "Bonus Sambutan",
    title: "Bonus Sambutan",
    value: "100% hingga Rp 1.000.000",
    cta: "Klaim Sekarang",
    tone: "green",
    ctaVariant: "gold",
    image: "/assets/mock/cta/promo-vault.png",
  },
  {
    id: "daily-rewards",
    label: "Hadiah Harian",
    title: "Hadiah Harian",
    value: "Login & dapatkan koin gratis",
    cta: "Klaim Harian",
    tone: "purple",
    ctaVariant: "gold",
    image: "/assets/mock/cta/promo-daily-bonus.png",
  },
  {
    id: "weekly-races",
    label: "Balapan Mingguan",
    title: "Balapan Mingguan",
    value: "Total hadiah Rp 50 juta",
    cta: "Ikuti Balapan",
    tone: "blue",
    ctaVariant: "primary",
    image: "/assets/mock/cta/promo-weekly-tournament.png",
  },
  {
    id: "vip-club",
    label: "Klub VIP",
    title: "Klub VIP",
    value: "Main lebih banyak, buka lebih banyak",
    cta: "Lihat Benefit",
    tone: "gold",
    ctaVariant: "gold",
    image: "/assets/mock/cta/promo-special-event.png",
  },
];

export default function PromoTiles() {
  return (
    <div className="vx-promo-row">
      {TILES.map((tile) => (
        <article key={tile.id} className={`vx-promo vx-promo--${tile.tone}`}>
          <div>
            <span className="vx-promo-label">{tile.label}</span>
            <h3 className="vx-promo-title">{tile.title}</h3>
            <p className="vx-promo-value">{tile.value}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tile.image} alt="" aria-hidden="true" />
          <button type="button" className={`vx-btn vx-btn--${tile.ctaVariant}`}>
            {tile.cta}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </article>
      ))}
    </div>
  );
}
