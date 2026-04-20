import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link className={styles.backLink} to="/">
        ← Back to search
      </Link>
    </div>
  );
}

export default NotFoundPage;
