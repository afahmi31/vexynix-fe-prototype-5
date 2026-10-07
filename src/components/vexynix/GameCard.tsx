"use client";

/**
 * Vexynix game card (handoff sections 6.6, 7.5, 8). The whole thumb opens the
 * game detail modal (touch parity, section 8.2); the hover overlay adds
 * Play/Demo without shifting the grid (section 8.1); the favorite affordance
 * stays above the overlay. Real play is gated behind a session — logged-out
 * players get the login modal instead.
 */
import { usePathname } from "next/navigation";
import type { Game } from "@/types/api";
import { MOCK_POPULARITY, MOCK_TOP10_RANKS } from "@/mocks/prototype-mock";
import { useSessionStore } from "@/stores/session";
import { useAuthModalStore } from "@/stores/auth-modal";
import { useLaunchGame } from "@/hooks/useLaunchGame";
import { useGameDetailStore } from "@/stores/game-detail";
import { formatCompact, vendorName } from "./data";
import FavoriteButton from "./FavoriteButton";

interface GameCardProps {
  game: Game;
  /** Catalog cards expose the favorite affordance (section 7.5). */
  showFavorite?: boolean;
}

export default function GameCard({ game, showFavorite = false }: GameCardProps) {
  const plays = MOCK_POPULARITY[game.id];
  const rank = MOCK_TOP10_RANKS[game.id];
  const openDetail = useGameDetailStore((s) => s.open);
  const token = useSessionStore((s) => s.token);
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const pathname = usePathname();
  const { launch, launchDemo, launching } = useLaunchGame();
  const busy = launching === game.id;

  const play = () => {
    if (!token) {
      openLogin({ next: pathname });
      return;
    }
    launch(game.id);
  };

  return (
    <article className="vx-game-card">
      <button
        type="button"
        className="vx-game-thumb"
        onClick={() => openDetail(game.id)}
        aria-label={`Lihat detail ${game.name}`}
      >
        {game.is_new && <span className="vx-game-badge vx-game-badge--new">BARU</span>}
        {rank && rank <= 3 && (
          <span className="vx-game-badge vx-game-badge--top">TOP {rank}</span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.image_url ?? ""} alt={game.name} loading="lazy" />
      </button>

      <div className="vx-game-overlay">
        <button
          type="button"
          className="vx-overlay-btn vx-overlay-btn--primary"
          onClick={play}
          disabled={busy}
        >
          <i className={busy ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-play"} aria-hidden="true" />
          {busy ? "Membuka…" : "Main"}
        </button>
        {game.demo_supported && (
          <button
            type="button"
            className="vx-overlay-btn vx-overlay-btn--ghost"
            onClick={() => launchDemo(game.id)}
            disabled={busy}
          >
            Coba Gratis
          </button>
        )}
      </div>

      {showFavorite && <FavoriteButton gameId={game.id} gameName={game.name} />}

      <button
        type="button"
        className="vx-game-title vx-game-title-btn"
        onClick={() => openDetail(game.id)}
      >
        {game.name}
      </button>

      <div className="vx-game-provider">
        <i className="fa-solid fa-tag" aria-hidden="true" />
        <span>{vendorName(game.vendor_id)}</span>
      </div>

      {typeof plays === "number" && (
        <div className="vx-game-plays">
          <i className="fa-solid fa-user-group" aria-hidden="true" />
          {formatCompact(plays)} pemain
        </div>
      )}
    </article>
  );
}
