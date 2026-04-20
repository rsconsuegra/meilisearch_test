export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "badge" | "date";
  truncate?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
}

export interface ImageContainerConfig {
  maxWidth: number;
  maxHeight: number;
}

export interface SearchConfig {
  indexName: string;
  appTitle: string;
  titleField: string;
  imageField: string | null;
  displayFields: FieldConfig[];
  filterableFields: FilterConfig[];
  hitsPerPage: number;
  imageContainers: {
    portrait: ImageContainerConfig;
    landscape: ImageContainerConfig;
  };
  sortOptions?: { label: string; value: string }[];
}

const DEFAULT_HITS_PER_PAGE = 12;

function parseHitsPerPage(value: string | undefined): number {
  if (!value) return DEFAULT_HITS_PER_PAGE;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_HITS_PER_PAGE;

  return parsed;
}

const indexName = import.meta.env.VITE_MEILISEARCH_INDEX ?? "movies";

export const searchConfig: SearchConfig = {
  indexName,
  appTitle: import.meta.env.VITE_APP_TITLE ?? "Movie Search",
  titleField: "title",
  imageField: "poster",
  displayFields: [
    { key: "overview", label: "Synopsis", type: "text", truncate: 150 },
    { key: "genres", label: "Genres", type: "badge" },
    { key: "release_date", label: "Release Date", type: "date" },
  ],
  filterableFields: [{ key: "genres", label: "Genre" }],
  hitsPerPage: parseHitsPerPage(import.meta.env.VITE_HITS_PER_PAGE),
  imageContainers: {
    portrait: { maxWidth: 400, maxHeight: 600 },
    landscape: { maxWidth: 800, maxHeight: 450 },
  },
  sortOptions: [
    { label: "Relevance", value: indexName },
    { label: "Title (A-Z)", value: `${indexName}:title:asc` },
    { label: "Title (Z-A)", value: `${indexName}:title:desc` },
  ],
};
