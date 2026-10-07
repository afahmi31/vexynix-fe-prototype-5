"use client";

/**
 * Vexynix game play screen (handoff section 10). Immersive full-bleed stage
 * built on the game artwork as the proportional launch surface — no invented
 * gameplay screenshots (section 10.2). Mode indicator + "Main Uang Asli" CTA
 * in demo mode (section 10.1). Related games come from the mock presentation
 * metadata, so they stay category-true (section 15).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { MOCK_CATALOG, MOCK_PRESENTATIONS } from "@/mocks/prototype-mock";
import { useSessionStore } from "@/stores/session";
import { useAuthModalStore } from "@/stores/auth-modal";
import { useLaunchGame } from "@/hooks/useLaunchGame";
import { categoryLabel, vendorName } from "./data";
import { VOLATILITY_LABELS, type Volatility } from "./catalog";
import FavoriteButton from "./FavoriteButton";
import GameCard from "./GameCard";
import LeftNavRail from "./LeftNavRail";
import PlayContextRail from "./PlayContextRail";
import type { Game } from "@/types/api";

const LOADING_MS = 2200;

function formatMultiplier(value: number): string {
  return `${new Intl.NumberFormat("id-ID").format(value)}x`;
}

export default function GamePlayPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isDemo = searchParams.get("mode") === "demo";

  const token = useSessionStore((s) => s.token);
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const { launch } = useLaunchGame();

  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLElement>(null);

  const game = MOCK_CATALOG.find((item) => item.id === params.id);

  // The stage boots through a short preparation beat: artwork + progress
  // indicator (section 10.2). Refresh replays it.
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [game?.id]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const related: Game[] = useMemo(() => {
    if (!game) return [];
    const ids = MOCK_PRESENTATIONS[game.id]?.related_game_ids ?? [];
    return ids
      .map((id) => MOCK_CATALOG.find((item) => item.id === id))
      .filter((item): item is Game => Boolean(item))
      .slice(0, 6);
  }, [game]);

  if (!game) {
    return (
      <main className="vx-play-layout">
        <LeftNavRail />
        <div className="vx-play">
          <div className="vx-play-empty">
            <i className="fa-solid fa-gamepad" aria-hidden="true" />
            <h1>Game tidak ditemukan</h1>
            <p>Pilihan game ini sudah tidak tersedia.</p>
            <a href="/games" className="vx-btn vx-btn--primary">
              Kembali ke Game
            </a>
          </div>
        </div>
      </main>
    );
  }

  const rtp = typeof game.rtp === "number" ? Math.round(game.rtp * 1000) / 10 : null;

  const playForReal = () => {
    if (!token) {
      openLogin({ next: pathname });
      return;
    }
    launch(game.id);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await stageRef.current?.requestFullscreen();
      }
    } catch {
      // Fullscreen can be rejected by the browser — the stage stays usable.
    }
  };

  const controls = [
    {
      key: "sound",
      icon: muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high",
      label: muted ? "Suara Mati" : "Suara",
      onClick: () => setMuted((prev) => !prev),
    },
    {
      key: "reload",
      icon: "fa-solid fa-rotate-right",
      label: "Muat Ulang",
      onClick: () => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), LOADING_MS);
      },
    },
    {
      key: "info",
      icon: "fa-solid fa-circle-info",
      label: "Info Game",
      onClick: () => infoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    },
    {
      key: "fullscreen",
      icon: "fa-solid fa-expand",
      label: isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh",
      onClick: toggleFullscreen,
    },
  ];

  return (
    <main className="vx-play-layout">
      <LeftNavRail />
      <div className="vx-play">
        <div className="vx-play-top">
          <a href="/games" className="vx-play-back">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Kembali ke Game
          </a>

          <div className="vx-play-identity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.image_url ?? ""} alt="" />
            <div>
              <strong>{game.name}</strong>
              <span>
                {vendorName(game.vendor_id)} · {categoryLabel(game.category)}
              </span>
            </div>
            <FavoriteButton gameId={game.id} gameName={game.name} />
          </div>

          <div className="vx-play-top-actions">
            {isDemo && <span className="vx-play-mode">Mode Demo</span>}
            {isDemo && (
              <button type="button" className="vx-btn vx-btn--primary" onClick={playForReal}>
                <i className="fa-solid fa-play" aria-hidden="true" />
                Main Uang Asli
              </button>
            )}
            <span className="vx-play-fair" title="Fair Play">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              Fair Play
            </span>
          </div>
        </div>

        <div className="vx-stage" ref={stageRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={game.image_url ?? ""} alt={game.name} />
          {isDemo && !loading && <span className="vx-stage-mode">Mode Demo</span>}
          {loading && (
            <div className="vx-stage-loading" role="status" aria-live="polite">
              <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
              Membuat game…
            </div>
          )}
        </div>

        <div className="vx-play-controls" role="toolbar" aria-label="Kontrol permainan">
          {controls.map((control) => (
            <button
              key={control.key}
              type="button"
              className="vx-play-control"
              onClick={control.onClick}
            >
              <i className={control.icon} aria-hidden="true" />
              <span>{control.label}</span>
            </button>
          ))}
        </div>

        <section className="vx-play-info" ref={infoRef} aria-label="Informasi game">
          <div className="vx-play-info-main">
            <h2>Tentang Game Ini</h2>
            <p>{MOCK_PRESENTATIONS[game.id]?.tagline ?? game.description}</p>
            <span className="vx-modal-trust">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              100% Aman &amp; Fair Play
            </span>
          </div>
          <div className="vx-play-info-stats">
            {rtp !== null && (
              <div className="vx-modal-stat">
                <i className="fa-solid fa-gauge-high" aria-hidden="true" />
                <div>
                  <span>RTP</span>
                  <strong>{rtp}%</strong>
                </div>
              </div>
            )}
            {game.volatility && (
              <div className="vx-modal-stat">
                <i className="fa-solid fa-chart-column" aria-hidden="true" />
                <div>
                  <span>Volatilitas</span>
                  <strong>{VOLATILITY_LABELS[game.volatility as Volatility]}</strong>
                </div>
              </div>
            )}
            {typeof game.maxWin === "number" && (
              <div className="vx-modal-stat">
                <i className="fa-solid fa-trophy" style={{ color: "#fbbf24" }} aria-hidden="true" />
                <div>
                  <span>Max Win</span>
                  <strong>{formatMultiplier(game.maxWin)}</strong>
                </div>
              </div>
            )}
            <div className="vx-modal-stat">
              <i className="fa-solid fa-tag" aria-hidden="true" />
              <div>
                <span>Provider</span>
                <strong>{vendorName(game.vendor_id)}</strong>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="vx-play-related" aria-label="Game serupa">
            <div className="vx-section-head">
              <h2 className="vx-section-title" style={{ fontSize: "19px" }}>
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
                Game Serupa
              </h2>
              <a href="/games" className="vx-section-see-all">
                Lihat Semua
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </a>
            </div>
            <div className="vx-game-grid vx-play-related-grid">
              {related.map((item) => (
                <GameCard key={item.id} game={item} showFavorite />
              ))}
            </div>
          </section>
        )}
      </div>
      <PlayContextRail game={game} onPlayReal={playForReal} />
    </main>
  );
}
