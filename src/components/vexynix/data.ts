/**
 * Vexynix lobby data selectors — every count and list here derives from the
 * mock catalog (handoff section 15.1). Never hardcode totals that exist in data.
 */
import type { Game } from "@/types/api";
import {
  MOCK_CATALOG,
  MOCK_POPULARITY,
  MOCK_TOP10_RANKS,
  MOCK_VENDORS,
} from "@/mocks/prototype-mock";

export interface CategoryMeta {
  key: string;
  label: string;
  icon: string;
}

/** Only categories that actually exist in the catalog (section 15.1). */
export const CATEGORY_ORDER: CategoryMeta[] = [
  { key: "slot", label: "Slots", icon: "fa-solid fa-dice" },
  { key: "live", label: "Live Casino", icon: "fa-solid fa-video" },
  { key: "table", label: "Table Games", icon: "fa-solid fa-club" },
  { key: "fish", label: "Tembak Ikan", icon: "fa-solid fa-fish" },
  { key: "sports", label: "Sports", icon: "fa-solid fa-futbol" },
  { key: "arcade", label: "Arcade", icon: "fa-solid fa-gamepad" },
];

export function categoryLabel(key: string): string {
  return CATEGORY_ORDER.find((c) => c.key === key)?.label ?? key;
}

export function vendorName(id: string): string {
  return MOCK_VENDORS.find((v) => v.id === id)?.name ?? id;
}

export function categoriesWithCounts(): Array<CategoryMeta & { count: number }> {
  return CATEGORY_ORDER.map((meta) => ({
    ...meta,
    count: MOCK_CATALOG.filter((g) => g.category === meta.key).length,
  })).filter((c) => c.count > 0);
}

function byPopularityDesc(a: Game, b: Game): number {
  return (MOCK_POPULARITY[b.id] ?? 0) - (MOCK_POPULARITY[a.id] ?? 0);
}

export function popularGames(limit = 8): Game[] {
  return MOCK_CATALOG.filter((g) => g.is_popular && g.status === "active")
    .sort(byPopularityDesc)
    .slice(0, limit);
}

export function newReleases(limit = 8): Game[] {
  return MOCK_CATALOG.filter((g) => g.is_new && g.status === "active")
    .sort(byPopularityDesc)
    .slice(0, limit);
}

export function top10Games(limit = 5): Array<{ game: Game; rank: number }> {
  return Object.entries(MOCK_TOP10_RANKS)
    .sort(([, a], [, b]) => a - b)
    .map(([id, rank]) => {
      const game = MOCK_CATALOG.find((g) => g.id === id);
      return game ? { game, rank } : null;
    })
    .filter((x): x is { game: Game; rank: number } => x !== null)
    .slice(0, limit);
}

export function totalGames(): number {
  return MOCK_CATALOG.filter((g) => g.status === "active").length;
}

export function totalProviders(): number {
  return MOCK_VENDORS.length;
}

/** id-ID compact formatting: 12400 -> "12,4 rb". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export interface LiveWinRow {
  player: string;
  amount: number;
  gameId: string;
  minutesAgo: number;
}

/**
 * Live activity feed. Player names and amounts are presentation flavor, but
 * every game referenced is a real catalog entry (section 15.1).
 */
export const LIVE_WINS: LiveWinRow[] = [
  { player: "Rian88", amount: 2480000, gameId: "gates-of-olympus", minutesAgo: 2 },
  { player: "DewiFortuna", amount: 1210000, gameId: "wild-bounty-showdown", minutesAgo: 6 },
  { player: "AgusMaxwin", amount: 6750000, gameId: "sugar-rush", minutesAgo: 11 },
  { player: "SultanBet", amount: 3320000, gameId: "velvet-roulette", minutesAgo: 18 },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
