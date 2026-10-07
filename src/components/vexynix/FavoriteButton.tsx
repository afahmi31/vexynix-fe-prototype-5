"use client";

/**
 * Shared favorite toggle — one store keeps the state identical across the
 * lobby, catalog, and detail surfaces (handoff section 15 rule 3).
 */
import { useEffect } from "react";
import { useFavoritesStore } from "@/stores/favorites";

interface FavoriteButtonProps {
  gameId: string;
  gameName: string;
  /** "icon" = floating circle on cards; "block" = full-width labeled button (modal). */
  variant?: "icon" | "block";
}

export default function FavoriteButton({ gameId, gameName, variant = "icon" }: FavoriteButtonProps) {
  const ids = useFavoritesStore((s) => s.ids);
  const hydrate = useFavoritesStore((s) => s.hydrate);
  const toggle = useFavoritesStore((s) => s.toggle);
  const active = ids.has(gameId);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const label = active ? `Hapus ${gameName} dari favorit` : `Tambahkan ${gameName} ke favorit`;

  return (
    <button
      type="button"
      className={`${variant === "block" ? "vx-fav-block" : "vx-fav"}${active ? " is-active" : ""}`}
      aria-pressed={active}
      aria-label={label}
      title={active ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(gameId);
      }}
    >
      <i className={`${active ? "fa-solid" : "fa-regular"} fa-heart`} aria-hidden="true" />
      {variant === "block" && (active ? "Hapus dari Favorit" : "Tambahkan ke Favorit")}
    </button>
  );
}
