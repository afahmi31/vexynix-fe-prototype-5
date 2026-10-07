"use client";

/**
 * Vexynix catalog toolbar (handoff section 7.4): heading + live result count,
 * sort dropdown, grid/list switcher, and the mobile Filters trigger with the
 * active-filter count badge.
 */
import { SORT_OPTIONS, type SortKey, type ViewMode } from "./catalog";

interface CatalogToolbarProps {
  heading: string;
  resultCount: number;
  totalCount: number;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filterCount: number;
  onOpenFilters: () => void;
}

export default function CatalogToolbar({
  heading,
  resultCount,
  totalCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  filterCount,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="vx-toolbar">
      <div className="vx-toolbar-info">
        <h2 className="vx-toolbar-title">
          {heading}
          <span>
            {resultCount} game{resultCount !== totalCount ? ` dari ${totalCount}` : ""}
          </span>
        </h2>
        <p className="vx-toolbar-sub">Temukan game favoritmu berikutnya dari koleksi kami</p>
      </div>

      <div className="vx-toolbar-controls">
        <button type="button" className="vx-filters-btn" onClick={onOpenFilters}>
          <i className="fa-solid fa-sliders" aria-hidden="true" />
          Filter
          {filterCount > 0 && <span className="vx-filters-badge">{filterCount}</span>}
        </button>

        <label className="vx-select">
          <span>Urutkan</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as SortKey)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down" aria-hidden="true" />
        </label>

        <div className="vx-view-toggle" role="group" aria-label="Mode tampilan">
          <button
            type="button"
            className={view === "grid" ? "is-active" : undefined}
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
          >
            <i className="fa-solid fa-table-cells-large" aria-hidden="true" />
            Grid
          </button>
          <button
            type="button"
            className={view === "list" ? "is-active" : undefined}
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <i className="fa-solid fa-list" aria-hidden="true" />
            List
          </button>
        </div>
      </div>
    </div>
  );
}
