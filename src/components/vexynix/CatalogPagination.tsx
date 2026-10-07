"use client";

/**
 * Vexynix pagination (handoff section 7.7): prev, windowed page numbers with
 * ellipsis, last page, next. Page math derives from the filtered result count
 * (section 15.1). Mobile keeps the same controls with 44px touch targets.
 */
import { pageCount, pageWindow } from "./catalog";

interface CatalogPaginationProps {
  page: number;
  resultCount: number;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({ page, resultCount, onPageChange }: CatalogPaginationProps) {
  const total = pageCount(resultCount);
  if (total <= 1) return null;

  const go = (next: number) => {
    onPageChange(Math.min(Math.max(next, 1), total));
  };

  return (
    <nav className="vx-pagination" aria-label="Navigasi halaman">
      <button
        type="button"
        className="vx-page-btn"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      {pageWindow(page, total).map((entry, index) =>
        entry === "…" ? (
          <span key={`ellipsis-${index}`} className="vx-page-ellipsis">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            className={`vx-page-btn${entry === page ? " is-active" : ""}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => go(entry)}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        className="vx-page-btn"
        onClick={() => go(page + 1)}
        disabled={page >= total}
        aria-label="Halaman berikutnya"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}
