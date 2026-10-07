"use client";

/**
 * Vexynix list-view row (handoff section 7.5 view switcher): thumbnail and
 * title open the detail modal; the Main button launches (session-gated);
 * tags are data-backed.
 */
import { usePathname } from "next/navigation";
import type { Game } from "@/types/api";
import { MOCK_POPULARITY } from "@/mocks/prototype-mock";
import { useSessionStore } from "@/stores/session";
import { useAuthModalStore } from "@/stores/auth-modal";
import { useLaunchGame } from "@/hooks/useLaunchGame";
import { useGameDetailStore } from "@/stores/game-detail";
import { categoryLabel, formatCompact, vendorName } from "./data";
import { VOLATILITY_LABELS, type Volatility } from "./catalog";
import FavoriteButton from "./FavoriteButton";

interface GameListRowProps {
  game: Game;
}

export default function GameListRow({ game }: GameListRowProps) {
  const plays = MOCK_POPULARITY[game.id];
  const rtp = typeof game.rtp === "number" ? Math.round(game.rtp * 1000) / 10 : null;
  const openDetail = useGameDetailStore((s) => s.open);
  const token = useSessionStore((s) => s.token);
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const pathname = usePathname();
  const { launch, launching } = useLaunchGame();
  const busy = launching === game.id;

  const play = () => {
    if (!token) {
      openLogin({ next: pathname });
      return;
    }
    launch(game.id);
  };

  return (
    <article className="vx-game-row">
      <button
        type="button"
        className="vx-game-row-thumb"
        onClick={() => openDetail(game.id)}
        aria-label={`Lihat detail ${game.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.image_url ?? ""} alt={game.name} loading="lazy" />
      </button>

      <div className="vx-game-row-meta">
        <button
          type="button"
          className="vx-game-title vx-game-title-btn"
          onClick={() => openDetail(game.id)}
        >
          {game.name}
        </button>
        <div className="vx-game-provider">
          <i className="fa-solid fa-tag" aria-hidden="true" />
          <span>
            {vendorName(game.vendor_id)} · {categoryLabel(game.category)}
          </span>
        </div>
        <div className="vx-game-row-tags">
          {rtp !== null && <span className="vx-tag vx-tag--rtp">RTP {rtp}%</span>}
          {game.volatility && (
            <span className="vx-tag vx-tag--vol">
              {VOLATILITY_LABELS[game.volatility as Volatility]}
            </span>
          )}
          {game.demo_supported && <span className="vx-tag vx-tag--demo">Gratis Demo</span>}
          {typeof plays === "number" && (
            <span className="vx-tag">{formatCompact(plays)} pemain</span>
          )}
        </div>
      </div>

      <div className="vx-game-row-actions">
        <FavoriteButton gameId={game.id} gameName={game.name} />
        <button
          type="button"
          className="vx-btn vx-btn--primary"
          onClick={play}
          disabled={busy}
        >
          {busy ? "Membuka…" : "Main"}
        </button>
      </div>
    </article>
  );
}
