"use client";

/**
 * Vexynix game catalog page (handoff section 7). Category hero, category tabs,
 * toolbar (sort + view), filtered/sorted/paginated grid, and the right rail
 * (promo + filters, drawer on small screens). Result counts always reflect the
 * active filters (section 15.1).
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CatalogHero from "./CatalogHero";
import CategoryNav from "./CategoryNav";
import CatalogToolbar from "./CatalogToolbar";
import FilterPanel from "./FilterPanel";
import GameCard from "./GameCard";
import GameListRow from "./GameListRow";
import CatalogPagination from "./CatalogPagination";
import { useAuthModalStore } from "@/stores/auth-modal";
import { categoryLabel } from "./data";
import {
  EMPTY_FILTER,
  activeFilterCount,
  applyFilter,
  categoryCount,
  paginate,
  sortGames,
  type CatalogFilter,
  type SortKey,
  type ViewMode,
} from "./catalog";

const HERO_SUBTITLE =
  "Slot, live casino, game meja, dan masih banyak lagi — semuanya di satu tempat.";

function initialSort(params: URLSearchParams): SortKey {
  const raw = params.get("sort");
  if (raw === "new" || raw === "rtp" || raw === "name" || raw === "popular") return raw;
  return "popular";
}

export default function GameCatalogPage() {
  const params = useSearchParams();
  const openRegister = useAuthModalStore((s) => s.openRegister);

  const [filter, setFilter] = useState<CatalogFilter>(() => ({
    ...EMPTY_FILTER,
    category: params.get("cat"),
    provider: params.get("provider"),
    q: params.get("q") ?? "",
  }));
  const [sort, setSort] = useState<SortKey>(() => initialSort(params));
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const patchFilter = (patch: Partial<CatalogFilter>) => {
    setFilter((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  // Query also flows in from the hero search — keep it in one state.
  const results = useMemo(() => sortGames(applyFilter(filter), sort), [filter, sort]);
  const visible = useMemo(() => paginate(results, page), [results, page]);

  // Deep-link changes (e.g. clicking another category from the lobby rail
  // while already on this page) should re-drive the filter.
  useEffect(() => {
    const cat = params.get("cat");
    const provider = params.get("provider");
    setFilter((prev) => ({
      ...prev,
      category: cat,
      provider: provider,
    }));
    setPage(1);
  }, [params]);

  // Escape closes the filter drawer (handoff section 18).
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  const heading = filter.category ? categoryLabel(filter.category) : "Semua Game";

  return (
    <div className={`vx-catalog${filtersOpen ? " vx-filters-open" : ""}`}>
      <CatalogHero
        title="Semua Game"
        subtitle={HERO_SUBTITLE}
        query={filter.q}
        onQueryChange={(q) => patchFilter({ q })}
      />

      <CategoryNav active={filter.category} onChange={(category) => patchFilter({ category })} />

      <div className="vx-catalog-body">
        <div className="vx-catalog-main">
          <CatalogToolbar
            heading={heading}
            resultCount={results.length}
            totalCount={categoryCount(filter.category)}
            sort={sort}
            onSortChange={(next) => {
              setSort(next);
              setPage(1);
            }}
            view={view}
            onViewChange={setView}
            filterCount={activeFilterCount(filter)}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          {visible.length === 0 ? (
            <div className="vx-empty">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <h3>Tidak ada game ditemukan</h3>
              <p>Coba sesuaikan filter atau pencarianmu.</p>
            </div>
          ) : view === "grid" ? (
            <div className="vx-game-grid">
              {visible.map((game) => (
                <GameCard key={game.id} game={game} showFavorite />
              ))}
            </div>
          ) : (
            <div className="vx-list-grid">
              {visible.map((game) => (
                <GameListRow key={game.id} game={game} />
              ))}
            </div>
          )}

          <CatalogPagination page={page} resultCount={results.length} onPageChange={setPage} />
        </div>

        <div className="vx-catalog-rail">
          <aside className="vx-rail-promo">
            <i className="fa-solid fa-crown" aria-hidden="true" />
            <strong>
              Main Lebih Besar
              <em>Hari Lebih Cerah</em>
            </strong>
            <p>Bergabung bersama pemain lain dan raih kemenanganmu setiap hari.</p>
            <button type="button" className="vx-btn vx-btn--primary" onClick={() => openRegister()}>
              Gabung Sekarang
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </aside>

          {/* Rail on desktop; fixed bottom sheet when opened on tablet/mobile. */}
          <div className="vx-filter-rail-drawer">
            <FilterPanel
              filter={filter}
              onChange={patchFilter}
              onClear={() => {
                setFilter({ ...EMPTY_FILTER });
                setPage(1);
              }}
              variant="drawer"
              onApply={() => setFiltersOpen(false)}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div
          className="vx-filters-scrim"
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
