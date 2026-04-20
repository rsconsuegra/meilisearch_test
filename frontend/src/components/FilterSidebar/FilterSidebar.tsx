import clsx from "clsx";
import { useState } from "react";
import { ClearRefinements, RefinementList } from "react-instantsearch";

import { searchConfig } from "../../config/searchConfig";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  className?: string;
}

function FilterSidebar({ className }: FilterSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (
    searchConfig.filterableFields.length === 0 &&
    (!searchConfig.sortOptions || searchConfig.sortOptions.length === 0)
  ) {
    return null;
  }

  return (
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
        className={clsx(styles.sidebar, sidebarOpen && styles.sidebarOpen, className)}
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
  );
}

export default FilterSidebar;
