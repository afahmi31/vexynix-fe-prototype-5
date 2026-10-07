/**
 * Vexynix catalog selectors (handoff section 7). Filtering, sorting, counts,
 * and pagination all derive from the mock catalog (section 15.1) — result
 * counts always reflect the active filters.
 */
import type { Game } from "@/types/api";
import { MOCK_CATALOG, MOCK_POPULARITY, MOCK_VENDORS } from "@/mocks/prototype-mock";
import { CATEGORY_ORDER } from "./data";

export const PAGE_SIZE = 24;

export const SORT_OPTIONS = [
  { key: "popular", label: "Paling Populer" },
  { key: "new", label: "Terbaru" },
  { key: "rtp", label: "RTP Tertinggi" },
  { key: "name", label: "A-Z" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];
export type ViewMode = "grid" | "list";
export type Volatility = "low" | "medium" | "high";

export interface CatalogFilter {
  q: string;
  category: string | null;
  provider: string | null;
  demoOnly: boolean;
  rtpMin: number; // percent, e.g. 95
  rtpMax: number; // percent, e.g. 100
  volatility: Volatility[];
}

export const EMPTY_FILTER: CatalogFilter = {
  q: "",
  category: null,
  provider: null,
  demoOnly: false,
  rtpMin: 90,
  rtpMax: 100,
  volatility: [],
};

export const RTP_BOUNDS = { min: 90, max: 100 };

export const VOLATILITY_LABELS: Record<Volatility, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export const VOLATILITY_OPTIONS: Volatility[] = ["low", "medium", "high"];

/** Providers that actually have games (section 15.1). */
export function providerOptions(): Array<{ id: string; name: string; count: number }> {
  return MOCK_VENDORS.map((vendor) => ({
    ...vendor,
    count: MOCK_CATALOG.filter((g) => g.vendor_id === vendor.id && g.status === "active").length,
  })).filter((v) => v.count > 0);
}

export function activeFilterCount(filter: CatalogFilter): number {
  let count = 0;
  if (filter.q.trim()) count += 1;
  if (filter.category) count += 1;
  if (filter.provider) count += 1;
  if (filter.demoOnly) count += 1;
  if (filter.rtpMin > RTP_BOUNDS.min || filter.rtpMax < RTP_BOUNDS.max) count += 1;
  count += filter.volatility.length;
  return count;
}

export function applyFilter(filter: CatalogFilter): Game[] {
  const q = filter.q.trim().toLowerCase();
  return MOCK_CATALOG.filter((game) => {
    if (game.status !== "active") return false;
    if (filter.category && game.category !== filter.category) return false;
    if (filter.provider && game.vendor_id !== filter.provider) return false;
    if (filter.demoOnly && !game.demo_supported) return false;
    const rtpPercent = (game.rtp ?? 0) * 100;
    if (rtpPercent < filter.rtpMin || rtpPercent > filter.rtpMax) return false;
    if (filter.volatility.length > 0 && !filter.volatility.includes(game.volatility as Volatility)) {
      return false;
    }
    if (q) {
      const haystack = `${game.name} ${game.vendor_id}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortGames(games: Game[], sort: SortKey): Game[] {
  const copy = [...games];
  switch (sort) {
    case "new":
      return copy.sort(
        (a, b) => Number(b.is_new ?? false) - Number(a.is_new ?? false) || a.name.localeCompare(b.name),
      );
    case "rtp":
      return copy.sort((a, b) => (b.rtp ?? 0) - (a.rtp ?? 0));
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "id"));
    case "popular":
    default:
      return copy.sort(
        (a, b) =>
          (MOCK_POPULARITY[b.id] ?? 0) - (MOCK_POPULARITY[a.id] ?? 0) ||
          Number(b.is_popular ?? false) - Number(a.is_popular ?? false) ||
          a.name.localeCompare(b.name),
      );
  }
}

export function paginate(games: Game[], page: number): Game[] {
  return games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

export function pageCount(resultCount: number): number {
  return Math.max(1, Math.ceil(resultCount / PAGE_SIZE));
}

/** Page numbers with ellipsis markers: 1 … 4 5 6 … 20 */
export function pageWindow(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function categoryTabs(): Array<{ key: string | null; label: string }> {
  return [
    { key: null, label: "Semua Game" },
    ...CATEGORY_ORDER.map((c) => ({ key: c.key, label: c.label })),
  ];
}

export function categoryCount(key: string | null): number {
  if (!key) return MOCK_CATALOG.filter((g) => g.status === "active").length;
  return MOCK_CATALOG.filter((g) => g.category === key && g.status === "active").length;
}
