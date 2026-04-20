import type { LoaderFunctionArgs } from "react-router-dom";

import type { SearchHit } from "../../types/search";
import { fetchDetailDocument } from "./fetchDetailDocument";
import { validateDetailId } from "./validation";

export async function detailLoader({ params }: LoaderFunctionArgs): Promise<SearchHit> {
  const id = validateDetailId(params.id);
  const hit = await fetchDetailDocument(id, AbortSignal.timeout(10_000));
  if (!hit) {
    throw new Response("Document not found.", { status: 404 });
  }

  return hit;
}
