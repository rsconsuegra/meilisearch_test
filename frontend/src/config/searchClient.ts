import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

export const { searchClient, meiliSearchInstance } = instantMeiliSearch(
  import.meta.env.VITE_MEILISEARCH_URL,
  import.meta.env.VITE_MEILISEARCH_API_KEY,
  { finitePagination: true },
);
