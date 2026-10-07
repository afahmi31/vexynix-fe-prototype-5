import type { Game } from "@/types/api";

/**
 * Presentation-layer contracts for the prototype mock catalog:
 * game presentation metadata, lobby shelves/promos, and the bundled mock shape.
 */

export type GameBadgeKind = "new" | "top10" | "popular" | "demo" | "editorial";

export type GameBadgeTone = "accent" | "success" | "warning" | "neutral";

export interface GameBadge {
  kind: GameBadgeKind;
  label: string;
  tone: GameBadgeTone;
  rank?: number;
  source: "catalog" | "mock-editorial";
}

export interface GamePresentation {
  game_id: string;
  poster_url?: string;
  backdrop_url?: string;
  tagline?: string;
  synopsis?: string;
  badges?: GameBadge[];
  related_game_ids?: string[];
}

export type LobbyShelfType = "top10" | "demo" | "category" | "vendor" | "editorial";

export interface LobbyShelf {
  id: string;
  title: string;
  icon: string;
  type: LobbyShelfType;
  category?: string;
  vendor_id?: string;
  limit: number;
}

export interface LobbyPromo {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta_label: string;
  cta_action: "register" | "deposit" | "lucky-pick";
  tone: "rose" | "cyan" | "gold";
  image_url?: string;
}

export interface LobbyFeatureConfig {
  id: "spinner" | "lucky-pick";
  title: string;
  description: string;
  action_label: string;
  image_url: string;
  enabled: boolean;
}

export interface LobbyTheme {
  name: string;
  background: string;
  surface: string;
  accent: string;
  accent_soft: string;
}

export interface LobbyConfig {
  hero_game_ids: string[];
  shelves: LobbyShelf[];
  promos: LobbyPromo[];
  features: {
    spinner: LobbyFeatureConfig;
    lucky_pick: LobbyFeatureConfig;
  };
  theme: LobbyTheme;
}

export interface MockData {
  games: Game[];
  presentations: Record<string, GamePresentation>;
  vendors: Array<{
    id: string;
    name: string;
    status: string;
    enabled: boolean;
  }>;
  lobby: LobbyConfig;
}
