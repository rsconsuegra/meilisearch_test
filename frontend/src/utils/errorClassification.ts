type ErrorWithStatusCode = Error & { statusCode?: number };

function getStatus(err: Error): number | undefined {
  const e = err as ErrorWithStatusCode;
  return e.statusCode;
}

export function isMeilisearchError(error: Error): boolean {
  if (
    error instanceof TypeError &&
    /failed to fetch|networkerror|err_connection/i.test(error.message)
  ) {
    return true;
  }

  const status = getStatus(error);
  if (status === 401 || status === 403) return true;
  if (status !== undefined && status >= 500) return true;

  return false;
}

export function getErrorMessage(error: Error): string {
  if (
    error instanceof TypeError &&
    /failed to fetch|networkerror|err_connection/i.test(error.message)
  ) {
    return "Unable to connect to the search engine. Please check that Meilisearch is running.";
  }

  const status = getStatus(error);
  if (status === 401 || status === 403) {
    return "Authentication failed. Please check your API key configuration.";
  }

  return error.message || "An unexpected error occurred.";
}

export function isNetworkError(error: Error): boolean {
  return (
    error instanceof TypeError && /failed to fetch|networkerror|err_connection/i.test(error.message)
  );
}
