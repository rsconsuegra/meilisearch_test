import { useSearchBox } from "react-instantsearch";

import styles from "./SearchLoader.module.css";

interface SearchLoaderProps {
  isSearchStalled?: boolean;
}

export default function SearchLoader({ isSearchStalled: stalledOverride }: SearchLoaderProps = {}) {
  const { isSearchStalled } = useSearchBox();
  const stalled = stalledOverride ?? isSearchStalled;

  if (!stalled) return null;

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}
