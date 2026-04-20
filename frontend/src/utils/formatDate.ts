function toDatePart(date: Date): string | null {
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0] ?? null;
}

export function formatDate(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "number") {
    return toDatePart(new Date(value * 1000)) ?? "";
  }

  if (typeof value === "string") {
    return toDatePart(new Date(value)) ?? value;
  }

  return String(value);
}
