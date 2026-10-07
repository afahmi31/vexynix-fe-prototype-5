/**
 * Favorites store — one set of game ids shared by every surface so the
 * favorite state stays identical across screens (handoff section 15 rule 3).
 * Persisted to localStorage.
 */
import { create } from "zustand";

const STORAGE_KEY = "vexynix-favorites";

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

interface FavoritesState {
  ids: Set<string>;
  hydrate: () => void;
  toggle: (gameId: string) => void;
  has: (gameId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set(),

  hydrate: () => {
    if (get().ids.size === 0) set({ ids: load() });
  },

  toggle: (gameId) => {
    const next = new Set(get().ids);
    if (next.has(gameId)) {
      next.delete(gameId);
    } else {
      next.add(gameId);
    }
    set({ ids: next });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Storage unavailable (private mode) — in-memory state still works.
    }
  },

  has: (gameId) => get().ids.has(gameId),
}));
