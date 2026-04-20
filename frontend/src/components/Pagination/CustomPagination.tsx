import clsx from "clsx";
import { useMemo } from "react";
import { usePagination } from "react-instantsearch";

import styles from "./CustomPagination.module.css";

const MAX_VISIBLE_PAGES = 6;

function CustomPagination() {
  const { currentRefinement, nbPages, refine, canRefine } = usePagination();

  const pages = useMemo(() => {
    if (!canRefine || nbPages <= 1) return [];

    const currentPage = currentRefinement + 1;

    let startPage = 1;
    if (nbPages > MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
      if (startPage + MAX_VISIBLE_PAGES - 1 > nbPages) {
        startPage = nbPages - MAX_VISIBLE_PAGES + 1;
      }
    }

    const endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, nbPages);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [canRefine, nbPages, currentRefinement]);

  if (!canRefine || nbPages <= 1) return null;

  const currentPage = currentRefinement + 1;

  return (
    <nav aria-label="Pagination" className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <button
            className={clsx(styles.button, currentRefinement === 0 && styles.buttonDisabled)}
            disabled={currentRefinement === 0}
            onClick={() => refine(currentRefinement - 1)}
            aria-label="Previous page"
            type="button"
          >
            ‹
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={styles.item}>
            <button
              className={clsx(styles.button, page === currentPage && styles.buttonActive)}
              onClick={() => refine(page - 1)}
              aria-label={`Page ${page}`}
              type="button"
            >
              {page}
            </button>
          </li>
        ))}
        <li className={styles.item}>
          <button
            className={clsx(
              styles.button,
              currentRefinement >= nbPages - 1 && styles.buttonDisabled,
            )}
            disabled={currentRefinement >= nbPages - 1}
            onClick={() => refine(currentRefinement + 1)}
            aria-label="Next page"
            type="button"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default CustomPagination;
