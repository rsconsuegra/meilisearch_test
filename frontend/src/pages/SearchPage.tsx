import clsx from "clsx";
import { useState } from "react";
import {
  ClearRefinements,
  Configure,
  InstantSearch,
  RefinementList,
  SearchBox,
  SortBy,
} from "react-instantsearch";
import { useLocation } from "react-router-dom";

import HitList from "../components/HitList/HitList";
import CustomPagination from "../components/Pagination/CustomPagination";
import { searchClient } from "../config/searchClient";
import { searchConfig } from "../config/searchConfig";
import { getResetKey } from "../types/navigation";
import styles from "./SearchPage.module.css";

function SearchPage() {
  const location = useLocation();
  const resetKey = getResetKey(location.state);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasSidebar =
    searchConfig.filterableFields.length > 0 ||
    (searchConfig.sortOptions !== undefined && searchConfig.sortOptions.length > 0);

  return (
    <InstantSearch
      key={resetKey}
      indexName={searchConfig.indexName}
      searchClient={searchClient}
      routing
    >
      <div className={styles.searchSection}>
        <SearchBox />
      </div>
      <Configure hitsPerPage={searchConfig.hitsPerPage} />
      <div className={styles.searchLayout}>
        {hasSidebar && (
          <>
            <button
              className={styles.sidebarToggle}
              onClick={() => setSidebarOpen((prev) => !prev)}
              type="button"
              aria-expanded={sidebarOpen}
              aria-controls="filter-sidebar"
            >
              Filters
            </button>
            <aside
              id="filter-sidebar"
              className={clsx(styles.sidebar, sidebarOpen && styles.sidebarOpen)}
            >
              {searchConfig.filterableFields.length > 0 && (
                <div className={styles.filterSection}>
                  <ClearRefinements />
                </div>
              )}
              {searchConfig.filterableFields.map((field) => (
                <div key={field.key} className={styles.filterSection}>
                  <h3 className={styles.filterHeading}>{field.label}</h3>
                  <RefinementList attribute={field.key} />
                </div>
              ))}
            </aside>
          </>
        )}
        <main className={styles.main}>
          {searchConfig.sortOptions && searchConfig.sortOptions.length > 0 && (
            <div className={styles.sortByWrapper}>
              <SortBy items={searchConfig.sortOptions} />
            </div>
          )}
          <HitList />
          <CustomPagination />
        </main>
      </div>
    </InstantSearch>
  );
}

export default SearchPage;
