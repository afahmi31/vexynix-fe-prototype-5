"use client";

/**
 * Section wrapper: heading + "See All" action on one baseline, then a game
 * grid (handoff section 6.6).
 */
import type { Game } from "@/types/api";
import GameCard from "./GameCard";

interface GameSectionProps {
  title: string;
  icon?: string;
  seeAllLabel?: string;
  seeAllHref?: string;
  games: Game[];
}

export default function GameSection({
  title,
  icon,
  seeAllLabel = "Lihat Semua",
  seeAllHref = "/games",
  games,
}: GameSectionProps) {
  if (games.length === 0) return null;

  return (
    <section className="vx-section">
      <div className="vx-section-head">
        <h2 className="vx-section-title">
          {icon && <i className={icon} aria-hidden="true" />}
          {title}
        </h2>
        <a href={seeAllHref} className="vx-section-see-all">
          {seeAllLabel}
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </a>
      </div>
      <div className="vx-game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
