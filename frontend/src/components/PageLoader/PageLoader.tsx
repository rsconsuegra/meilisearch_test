import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className={styles.container} role="status" aria-label="Loading…">
      <div className={styles.spinner} />
      <span className={styles.label}>Loading…</span>
    </div>
  );
}
