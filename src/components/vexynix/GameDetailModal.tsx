"use client";

/**
 * Vexynix game detail modal (handoff section 9). Two-panel dialog with
 * backdrop fade + upward scale entry (300ms) and a slightly faster close
 * (220ms). Focus is trapped inside the dialog and returned to the card that
 * opened it (section 18). Backdrop click, Esc, and the close button all close.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MOCK_CATALOG, MOCK_PRESENTATIONS } from "@/mocks/prototype-mock";
import { useGameDetailStore } from "@/stores/game-detail";
import { useSessionStore } from "@/stores/session";
import { useAuthModalStore } from "@/stores/auth-modal";
import { useLaunchGame } from "@/hooks/useLaunchGame";
import { categoryLabel, vendorName } from "./data";
import { VOLATILITY_LABELS, type Volatility } from "./catalog";
import FavoriteButton from "./FavoriteButton";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const CLOSE_MS = 220;

function formatMultiplier(value: number): string {
  return `${new Intl.NumberFormat("id-ID").format(value)}x`;
}

export default function GameDetailModal() {
  const gameId = useGameDetailStore((s) => s.gameId);
  const closeStore = useGameDetailStore((s) => s.close);
  const pathname = usePathname();
  const token = useSessionStore((s) => s.token);
  const openLogin = useAuthModalStore((s) => s.openLogin);
  const { launch, launchDemo, launching, error } = useLaunchGame();

  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const game = gameId ? MOCK_CATALOG.find((g) => g.id === gameId) : undefined;
  const open = Boolean(game);

  const handleClose = () => {
    if (leaving) return;
    setLeaving(true);
    closeTimer.current = window.setTimeout(() => {
      setLeaving(false);
      setEntered(false);
      closeStore();
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!open) return;

    // Remember the card that opened the modal; lock page scroll behind it.
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntered(true));

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Move focus into the dialog once it is visible, trap Tab inside it, and
  // close on Escape (handoff section 18).
  useEffect(() => {
    if (!open || !entered) return;

    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusables?.[1] ?? focusables?.[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entered]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  if (!game) return null;

  const presentation = MOCK_PRESENTATIONS[game.id];
  const busy = launching === game.id;
  const rtp = typeof game.rtp === "number" ? Math.round(game.rtp * 1000) / 10 : null;
  const tagline = presentation?.tagline;
  const galleryGames = (presentation?.related_game_ids ?? [])
    .map((id) => MOCK_CATALOG.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is typeof game => Boolean(candidate))
    .slice(0, 3);

  const chips: Array<{ label: string; hot?: boolean }> = [
    { label: categoryLabel(game.category) },
    ...(game.is_new ? [{ label: "Baru" }] : []),
    ...(game.is_popular ? [{ label: "Populer", hot: true }] : []),
    ...(game.demo_supported ? [{ label: "Gratis Demo" }] : []),
  ];

  const features = [
    { icon: "fa-solid fa-bolt", label: "Instan Tanpa Unduh", color: "#a78bfa" },
    game.category === "live"
      ? { icon: "fa-solid fa-video", label: "Live Dealer", color: "#f472b6" }
      : { icon: "fa-solid fa-gamepad", label: "Mode Demo Gratis", color: "#f472b6" },
    { icon: "fa-solid fa-mobile-screen", label: "Main di Semua Perangkat", color: "#fbbf24" },
  ].filter((feature) => (feature.label === "Mode Demo Gratis" ? game.demo_supported : true));

  const play = () => {
    if (!token) {
      openLogin({ next: pathname });
      return;
    }
    launch(game.id);
  };

  return (
    <div
      className={`vx-modal-backdrop${entered ? " is-in" : ""}${leaving ? " is-leaving" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        className="vx-modal"
        role="dialog"
        aria-modal="true"
        aria-label={game.name}
        ref={dialogRef}
      >
        <button
          type="button"
          className="vx-modal-close"
          onClick={handleClose}
          aria-label="Tutup detail game"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <div className="vx-modal-media">
          <div className="vx-modal-artwork">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.image_url ?? ""} alt={game.name} />
            {game.is_new && <span className="vx-game-badge vx-game-badge--new">BARU</span>}
          </div>
          {galleryGames.length > 0 && (
            <div className="vx-modal-gallery" aria-label="Pratinjau game terkait">
              <button
                type="button"
                className="is-active"
                aria-label={`Pratinjau ${game.name}`}
                onClick={() => useGameDetailStore.getState().open(game.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={game.image_url ?? ""} alt="" />
                <i className="fa-solid fa-play" aria-hidden="true" />
              </button>
              {galleryGames.map((galleryGame) => (
                <button
                  type="button"
                  key={galleryGame.id}
                  aria-label={`Lihat ${galleryGame.name}`}
                  onClick={() => useGameDetailStore.getState().open(galleryGame.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={galleryGame.image_url ?? ""} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="vx-modal-body">
          <h2 className="vx-modal-title">{game.name}</h2>

          <div className="vx-modal-byline">
            <span>Oleh {vendorName(game.vendor_id)}</span>
            <span className="vx-modal-byline-dot" aria-hidden="true" />
            <span>{categoryLabel(game.category)}</span>
          </div>

          <div className="vx-modal-chips">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={`vx-modal-chip${chip.hot ? " vx-modal-chip--hot" : ""}`}
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="vx-modal-stats">
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
          </div>

          {(tagline || game.description) && (
            <p className="vx-modal-desc">{tagline ?? game.description}</p>
          )}

          <div className="vx-modal-features">
            {features.map((feature) => (
              <div className="vx-modal-feature" key={feature.label}>
                <i className={feature.icon} style={{ color: feature.color }} aria-hidden="true" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="vx-modal-ctas">
            <button type="button" className="vx-btn vx-btn--primary" onClick={play} disabled={busy}>
              <i
                className={busy ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-play"}
                aria-hidden="true"
              />
              {busy ? "Membuka…" : "Main Sekarang"}
            </button>
            {game.demo_supported && (
              <button
                type="button"
                className="vx-btn vx-btn--ghost"
                onClick={() => launchDemo(game.id)}
                disabled={busy}
              >
                <i className="fa-solid fa-gamepad" aria-hidden="true" />
                Coba Gratis
              </button>
            )}
            <FavoriteButton gameId={game.id} gameName={game.name} variant="block" />
            {error && <p className="vx-modal-error">{error}</p>}
          </div>

          <div className="vx-modal-foot">
            <span className="vx-modal-trust">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              100% Aman &amp; Fair Play
            </span>
            <a href={`/play/${encodeURIComponent(game.id)}`} className="vx-modal-more">
              Info Lengkap
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
