import { Link } from "react-router-dom";

import styles from "./DetailPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.sectionContent}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link className={styles.backButton} to="/">
        ← Back to search
      </Link>
    </div>
  );
}

export default NotFoundPage;
