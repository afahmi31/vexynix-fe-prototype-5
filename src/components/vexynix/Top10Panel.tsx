"use client";

/**
 * Vexynix Top 10 ranking panel (handoff section 6.7). Ranks come from
 * MOCK_TOP10_RANKS; momentum values from MOCK_POPULARITY (section 15.4).
 * Rows open the game detail modal (touch parity, section 8.2).
 */
import { MOCK_POPULARITY } from "@/mocks/prototype-mock";
import { useGameDetailStore } from "@/stores/game-detail";
import { formatCompact, top10Games, vendorName } from "./data";

export default function Top10Panel() {
  const rows = top10Games(5);
  const openDetail = useGameDetailStore((s) => s.open);

  return (
    <section className="vx-top10" aria-label="Top 10 game minggu ini">
      <div className="vx-top10-head">
        <h3>Top 10 Game Minggu Ini</h3>
        <i className="fa-solid fa-trophy" aria-hidden="true" style={{ color: "var(--vx-gold)" }} />
      </div>

      {rows.map(({ game, rank }) => {
        const score = MOCK_POPULARITY[game.id];
        return (
          <button
            key={game.id}
            type="button"
            className="vx-top10-row"
            onClick={() => openDetail(game.id)}
          >
            <span className={`vx-top10-rank${rank <= 3 ? ` vx-top10-rank--${rank}` : ""}`}>
              {rank}
            </span>
            <span className="vx-top10-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.image_url ?? ""} alt={game.name} loading="lazy" />
            </span>
            <span className="vx-top10-meta">
              <strong>{game.name}</strong>
              <span>{vendorName(game.vendor_id)}</span>
            </span>
            {typeof score === "number" && (
              <span className={`vx-top10-score ${rank === 1 ? "vx-top10-score--fire" : "vx-top10-score--up"}`}>
                <i className={rank === 1 ? "fa-solid fa-fire" : "fa-solid fa-arrow-trend-up"} aria-hidden="true" />
                {formatCompact(score)}
              </span>
            )}
          </button>
        );
      })}

      <a href="/games?sort=popular" className="vx-btn vx-btn--primary">
        Lihat Top 10 Game
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </a>
    </section>
  );
}
