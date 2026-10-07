/**
 * Game detail modal store — which game's detail dialog is open. The modal
 * itself is mounted once in the public layout; cards open it by game id
 * (handoff sections 8.2 and 9).
 */
import { create } from "zustand";

interface GameDetailState {
  gameId: string | null;
  open: (gameId: string) => void;
  close: () => void;
}

export const useGameDetailStore = create<GameDetailState>((set) => ({
  gameId: null,
  open: (gameId) => set({ gameId }),
  close: () => set({ gameId: null }),
}));
