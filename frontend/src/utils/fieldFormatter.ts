import type { SearchHit } from "../types/search";
import { getField } from "../types/search";
import { formatDate } from "./formatDate";

export function formatFieldValue(value: unknown, type?: string, truncate?: number): string {
  if (value == null) return "";

  if (Array.isArray(value)) {
    const joined = value.join(", ");
    if (truncate && joined.length > truncate) {
      return joined.slice(0, truncate) + "\u2026";
    }
    return joined;
  }

  if (type === "date") {
    return formatDate(value);
  }

  const str = String(value);
  if (truncate && str.length > truncate) {
    return str.slice(0, truncate) + "\u2026";
  }

  return str;
}

export function getFieldTitle(hit: SearchHit, titleField: string): string {
  return String(getField(hit, titleField) ?? "Untitled");
}

export function getFieldImage(hit: SearchHit, imageField: string | null): string | null {
  if (!imageField) return null;
  const value = getField(hit, imageField);
  return value ? String(value) : null;
}
