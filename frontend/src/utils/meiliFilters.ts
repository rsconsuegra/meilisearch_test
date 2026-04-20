export function buildIdFilter(id: string): string {
  if (!/^\d+$/.test(id)) {
    throw new Error("Invalid document ID.");
  }

  return `id = ${id}`;
}
