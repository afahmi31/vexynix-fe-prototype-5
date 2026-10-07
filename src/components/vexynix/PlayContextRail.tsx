"use client";

import type { Game } from "@/types/api";
import { LIVE_WINS, formatRupiah, vendorName } from "./data";
import { MOCK_CATALOG } from "@/mocks/prototype-mock";
import { VOLATILITY_LABELS, type Volatility } from "./catalog";
import FavoriteButton from "./FavoriteButton";

interface PlayContextRailProps {
  game: Game;
  onPlayReal: () => void;
}

export default function PlayContextRail({ game, onPlayReal }: PlayContextRailProps) {
  return (
    <aside className="vx-play-context" aria-label="Game dan aktivitas terkait">
      <section className="vx-play-game-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={game.image_url ?? ""} alt={game.name} />
        <div className="vx-play-game-copy">
          <h2>{game.name}</h2>
          <p>
            <i className="fa-solid fa-gamepad" aria-hidden="true" />
            {vendorName(game.vendor_id)}
          </p>
        </div>
        <div className="vx-play-rail-stats">
          <span>
            <small>RTP</small>
            <strong>{game.rtp ? `${Math.round(game.rtp * 1000) / 10}%` : "-"}</strong>
          </span>
          <span>
            <small>Volatilitas</small>
            <strong>
              {game.volatility ? VOLATILITY_LABELS[game.volatility as Volatility] : "-"}
            </strong>
          </span>
          <span>
            <small>Max Win</small>
            <strong>{game.maxWin ? `${game.maxWin.toLocaleString("id-ID")}x` : "-"}</strong>
          </span>
        </div>
        <button type="button" className="vx-btn vx-btn--primary" onClick={onPlayReal}>
          <i className="fa-solid fa-play" aria-hidden="true" />
          Main Sekarang
        </button>
        {game.demo_supported && (
          <a
            href={`/play/${encodeURIComponent(game.id)}?mode=demo`}
            className="vx-btn vx-btn--ghost"
          >
            <i className="fa-solid fa-gamepad" aria-hidden="true" />
            Coba Gratis
          </a>
        )}
        <FavoriteButton gameId={game.id} gameName={game.name} variant="block" />
      </section>

      <section className="vx-play-bonus-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mock/cta/promo-daily-bonus.png" alt="" aria-hidden="true" />
        <div>
          <span>Bonus Sambutan</span>
          <strong>100%</strong>
          <small>Hingga Rp 1.000.000</small>
        </div>
        <a href="/register" className="vx-btn vx-btn--gold">
          Klaim Sekarang
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </a>
      </section>

      <section className="vx-play-winners">
        <div className="vx-play-context-heading">
          <h2>Pemenang Terbaru</h2>
          <span className="vx-live-pill">Live</span>
        </div>
        {LIVE_WINS.map((winner) => {
          const winnerGame = MOCK_CATALOG.find((item) => item.id === winner.gameId);
          return (
            <div className="vx-play-winner" key={winner.player}>
              <span className="vx-live-avatar" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={winnerGame?.image_url ?? ""} alt="" />
              </span>
              <span>
                <strong>{winner.player}</strong>
                <small>
                  Menang <b>{formatRupiah(winner.amount)}</b>
                </small>
              </span>
              <time>{winner.minutesAgo}m</time>
            </div>
          );
        })}
      </section>
    </aside>
  );
}
