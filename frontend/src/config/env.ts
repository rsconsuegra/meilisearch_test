export interface EnvConfig {
  readonly meilisearchUrl: string;
  readonly meilisearchApiKey: string;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateEnv(
  env: Record<string, string | undefined> = import.meta.env as Record<string, string | undefined>,
): EnvConfig {
  const url = env.VITE_MEILISEARCH_URL;
  const apiKey = env.VITE_MEILISEARCH_API_KEY;

  if (!url) {
    throw new Error("Missing environment variable: VITE_MEILISEARCH_URL");
  }

  if (!isValidUrl(url)) {
    throw new Error("Invalid URL format: VITE_MEILISEARCH_URL");
  }

  if (!apiKey) {
    throw new Error("Missing environment variable: VITE_MEILISEARCH_API_KEY");
  }

  return { meilisearchUrl: url, meilisearchApiKey: apiKey };
}
