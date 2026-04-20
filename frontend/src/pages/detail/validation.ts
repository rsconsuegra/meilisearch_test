import { isValidNumericId } from "../../utils/validators";

export { isValidNumericId };

export function validateDetailId(id: string | undefined): string {
  if (!id) throw new Response("Missing document ID.", { status: 400 });
  if (!isValidNumericId(id)) throw new Response("Invalid document ID.", { status: 400 });
  return id;
}
