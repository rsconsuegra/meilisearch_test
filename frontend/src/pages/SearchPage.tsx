import { Configure, InstantSearch, SearchBox, SortBy } from "react-instantsearch";
import { useLocation } from "react-router-dom";

import FilterSidebar from "../components/FilterSidebar/FilterSidebar";
import HitList from "../components/HitList/HitList";
import CustomPagination from "../components/Pagination/CustomPagination";
import SearchLoader from "../components/SearchLoader/SearchLoader";
import { searchClient } from "../config/searchClient";
import { searchConfig } from "../config/searchConfig";
import { getResetKey } from "../types/navigation";
import styles from "./SearchPage.module.css";

function SearchPage() {
  const location = useLocation();
  const resetKey = getResetKey(location.state);

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
      <Configure
        attributesToHighlight={searchConfig.displayFields
          .filter((f) => f.type === "text" || f.type === "badge")
          .map((f) => f.key)}
        attributesToSnippet={searchConfig.displayFields
          .filter((f) => f.truncate !== undefined)
          .map((f) => `${f.key}:${f.truncate}`)}
        hitsPerPage={searchConfig.hitsPerPage}
      />
      <div className={styles.searchLayout}>
        {hasSidebar && <FilterSidebar />}
        <main className={styles.main}>
          {searchConfig.sortOptions && searchConfig.sortOptions.length > 0 && (
            <div className={styles.sortByWrapper}>
              <SortBy items={searchConfig.sortOptions} />
            </div>
          )}
          <SearchLoader />
          <HitList />
          <CustomPagination />
        </main>
      </div>
    </InstantSearch>
  );
}

export default SearchPage;
