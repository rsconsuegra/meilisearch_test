/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEILISEARCH_URL: string;
  readonly VITE_MEILISEARCH_API_KEY: string;
  readonly VITE_MEILISEARCH_INDEX?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_HITS_PER_PAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
