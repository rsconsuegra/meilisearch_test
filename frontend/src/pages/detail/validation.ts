export function validateDetailId(id: string | undefined): string {
  if (!id) throw new Response("Missing document ID.", { status: 400 });
  if (!/^\d+$/.test(id)) throw new Response("Invalid document ID.", { status: 400 });
  return id;
}

export function getDetailValidationError(id: string | undefined): string | null {
  if (!id) return "Missing document ID.";
  if (!/^\d+$/.test(id)) return "Invalid document ID.";
  return null;
}
