import { useHits } from "react-instantsearch";

import { asSearchHit } from "../../types/search";
import HitCard from "../HitCard/HitCard";
import styles from "./HitList.module.css";

function HitList() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return <p className={styles.emptyState}>No results found.</p>;
  }

  return (
    <ol className={styles.hitList} data-testid="hit-list">
      {hits.map((hit) => {
        const typedHit = asSearchHit(hit as Record<string, unknown>);
        return (
          <li key={typedHit.id} className={styles.hitItem}>
            <HitCard hit={typedHit} />
          </li>
        );
      })}
    </ol>
  );
}

export default HitList;
