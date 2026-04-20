import { meiliSearchInstance } from "../../config/searchClient";
import { searchConfig } from "../../config/searchConfig";
import type { SearchHit } from "../../types/search";
import { buildIdFilter } from "../../utils/meiliFilters";

export async function fetchDetailDocument(
  id: string,
  signal: AbortSignal,
): Promise<SearchHit | null> {
  const result = await meiliSearchInstance
    .index(searchConfig.indexName)
    .search<SearchHit>("", { filter: buildIdFilter(id), hitsPerPage: 1 }, { signal });

  return result.hits[0] ?? null;
}
