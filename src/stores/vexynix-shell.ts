/**
 * Vexynix shell state — owns the left-rail drawer on tablet/mobile so the
 * header (layout-rendered) and the rail (page-rendered) can share it.
 */
import { create } from "zustand";

interface VexynixShellState {
  railOpen: boolean;
  toggleRail: () => void;
  closeRail: () => void;
}

export const useVexynixShell = create<VexynixShellState>((set) => ({
  railOpen: false,
  toggleRail: () => set((s) => ({ railOpen: !s.railOpen })),
  closeRail: () => set({ railOpen: false }),
}));
