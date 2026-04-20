export interface SearchHit {
  id: string | number;
  [key: string]: unknown;
}

export function getField(hit: SearchHit, key: string): unknown {
  return key in hit ? hit[key] : undefined;
}

export function asSearchHit(raw: Record<string, unknown>): SearchHit {
  const candidateId = raw.objectID ?? raw.id;
  if (typeof candidateId !== "string" && typeof candidateId !== "number") {
    throw new Error("Hit is missing a valid objectID or id");
  }

  return { ...raw, id: candidateId };
}
