import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination Component
 *
 * Props:
 *  - count:        Total number of records (from API `count` field)
 *  - page:         Current page number (1-indexed)
 *  - pageSize:     Records per page (default 20, matching backend default)
 *  - onPageChange: Callback with new page number
 */
export const Pagination = ({ count = 0, page = 1, pageSize = 20, onPageChange }) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Build page number list — show max 5 pages around current
  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (left > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }
    if (right < totalPages) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={styles.container}>
      <span style={styles.info}>
        Showing {Math.min((page - 1) * pageSize + 1, count)}–{Math.min(page * pageSize, count)} of {count}
      </span>

      <div style={styles.controls}>
        {/* Previous */}
        <button
          style={{ ...styles.btn, ...(hasPrev ? {} : styles.btnDisabled) }}
          onClick={() => hasPrev && onPageChange(page - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {getPages().map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} style={styles.dots}>…</span>
          ) : (
            <button
              key={p}
              style={{ ...styles.btn, ...(p === page ? styles.btnActive : {}) }}
              onClick={() => p !== page && onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          style={{ ...styles.btn, ...(hasNext ? {} : styles.btnDisabled) }}
          onClick={() => hasNext && onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '0 0 var(--border-radius) var(--border-radius)',
  },
  info: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: '0 0.5rem',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-main)',
    fontSize: '0.8125rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnActive: {
    backgroundColor: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  dots: {
    padding: '0 0.25rem',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
  },
};
