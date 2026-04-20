import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

import sharedStyles from "../styles/shared.module.css";
import styles from "./DetailError.module.css";

function DetailError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? (error.data ?? error.statusText)
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <div className={sharedStyles.detailContainer}>
      <button className={sharedStyles.backButton} onClick={() => navigate(-1)} type="button">
        ← Back to results
      </button>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default DetailError;
