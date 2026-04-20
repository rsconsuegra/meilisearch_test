import { isValidNumericId } from "./validators";

export function buildIdFilter(id: string): string {
  if (!isValidNumericId(id)) {
    throw new Error("Invalid document ID.");
  }

  return `id = ${id}`;
}
