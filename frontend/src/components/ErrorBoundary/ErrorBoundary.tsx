import { Component, type ErrorInfo, type ReactNode } from "react";

import {
  getErrorMessage,
  isMeilisearchError,
  isNetworkError,
} from "../../utils/errorClassification";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleRetry = (): void => {
    if (this.state.error && isNetworkError(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ error: null, hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const error = this.state.error;
      const contextual = isMeilisearchError(error);
      const message = getErrorMessage(error);

      return (
        <div className={`${styles.container} ${contextual ? styles.contextual : ""}`}>
          <h1 className={styles.title}>
            {contextual ? "Search service error" : "Something went wrong"}
          </h1>
          <p className={styles.message}>{message}</p>
          <button className={styles.retryButton} onClick={this.handleRetry} type="button">
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
