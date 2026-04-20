export function isValidNumericId(id: string): boolean {
  return /^\d+$/.test(id);
}
