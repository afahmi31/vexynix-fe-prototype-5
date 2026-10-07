"use client";

/**
 * Vexynix filter panel (handoff section 7.6). Options reflect real data only
 * (section 15.1): providers with games, a demo flag that exists on the Game
 * record, RTP from each game's value, volatility from the additive mock
 * metadata. Feature checkboxes beyond "Gratis Demo" are omitted because no
 * backing data exists. Desktop applies filters live; the mobile drawer adds
 * explicit Apply / Clear actions (section 4.2 rule 10).
 */
import { CATEGORY_ORDER } from "./data";
import {
  EMPTY_FILTER,
  RTP_BOUNDS,
  VOLATILITY_LABELS,
  VOLATILITY_OPTIONS,
  type CatalogFilter,
  type Volatility,
} from "./catalog";
import { categoryCount, providerOptions } from "./catalog";

interface FilterPanelProps {
  filter: CatalogFilter;
  onChange: (patch: Partial<CatalogFilter>) => void;
  onClear: () => void;
  /** Drawer mode appends the explicit Apply/Close actions (mobile). */
  variant?: "rail" | "drawer";
  onApply?: () => void;
  onClose?: () => void;
}

export default function FilterPanel({
  filter,
  onChange,
  onClear,
  variant = "rail",
  onApply,
  onClose,
}: FilterPanelProps) {
  const providers = providerOptions();

  const toggleVolatility = (value: Volatility) => {
    const next = filter.volatility.includes(value)
      ? filter.volatility.filter((v) => v !== value)
      : [...filter.volatility, value];
    onChange({ volatility: next });
  };

  return (
    <section className="vx-filter-panel" aria-label="Filter game">
      <div className="vx-filter-head">
        <h3>Filter</h3>
        <div className="vx-filter-head-actions">
          <button type="button" onClick={onClear}>
            Hapus Semua
          </button>
          {variant === "drawer" && onClose && (
            <button type="button" className="vx-filter-close" onClick={onClose}>
              <i className="fa-solid fa-xmark" aria-hidden="true" />
              Tutup
            </button>
          )}
        </div>
      </div>

      <div className="vx-filter-search">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          placeholder="Cari game…"
          aria-label="Cari game di filter"
          value={filter.q}
          onChange={(event) => onChange({ q: event.target.value })}
        />
      </div>

      <div className="vx-filter-group">
        <span className="vx-filter-label">Kategori</span>
        <label className="vx-check">
          <input
            type="radio"
            name="filter-category"
            checked={filter.category === null}
            onChange={() => onChange({ category: null })}
          />
          Semua Kategori
        </label>
        {CATEGORY_ORDER.map((cat) => (
          <label key={cat.key} className="vx-check">
            <input
              type="radio"
              name="filter-category"
              checked={filter.category === cat.key}
              onChange={() => onChange({ category: cat.key })}
            />
            {cat.label}
            <span className="vx-check-count">{categoryCount(cat.key)}</span>
          </label>
        ))}
      </div>

      <div className="vx-filter-group">
        <span className="vx-filter-label">Provider</span>
        {providers.map((provider) => (
          <label key={provider.id} className="vx-check">
            <input
              type="radio"
              name="filter-provider"
              checked={filter.provider === provider.id}
              onChange={() =>
                onChange({ provider: filter.provider === provider.id ? null : provider.id })
              }
            />
            {provider.name}
            <span className="vx-check-count">{provider.count}</span>
          </label>
        ))}
      </div>

      <div className="vx-filter-group">
        <span className="vx-filter-label">Fitur</span>
        <label className="vx-check">
          <input
            type="checkbox"
            checked={filter.demoOnly}
            onChange={(event) => onChange({ demoOnly: event.target.checked })}
          />
          Gratis Demo
        </label>
      </div>

      <div className="vx-filter-group">
        <span className="vx-filter-label">Rentang RTP</span>
        <div className="vx-filter-range">
          <input
            type="range"
            min={RTP_BOUNDS.min}
            max={RTP_BOUNDS.max}
            step={0.5}
            value={filter.rtpMin}
            aria-label="RTP minimum"
            onChange={(event) =>
              onChange({ rtpMin: Math.min(Number(event.target.value), filter.rtpMax) })
            }
          />
          <input
            type="range"
            min={RTP_BOUNDS.min}
            max={RTP_BOUNDS.max}
            step={0.5}
            value={filter.rtpMax}
            aria-label="RTP maksimum"
            onChange={(event) =>
              onChange({ rtpMax: Math.max(Number(event.target.value), filter.rtpMin) })
            }
          />
          <div className="vx-filter-range-labels">
            <span>Min {filter.rtpMin}%</span>
            <span>Maks {filter.rtpMax}%</span>
          </div>
        </div>
      </div>

      <div className="vx-filter-group">
        <span className="vx-filter-label">Volatilitas</span>
        {VOLATILITY_OPTIONS.map((vol) => (
          <label key={vol} className="vx-check">
            <input
              type="checkbox"
              checked={filter.volatility.includes(vol)}
              onChange={() => toggleVolatility(vol)}
            />
            {VOLATILITY_LABELS[vol]}
          </label>
        ))}
      </div>

      {variant === "drawer" && (
        <button type="button" className="vx-btn vx-btn--primary vx-filter-apply" onClick={onApply}>
          Terapkan Filter
        </button>
      )}
    </section>
  );
}

export { EMPTY_FILTER };
