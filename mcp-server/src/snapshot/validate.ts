import { SnapshotSchema, type Snapshot } from "../schema.js";

export type ValidationResult =
  | { ok: true; snapshot: Snapshot }
  | { ok: false; error: string };

export function validateSnapshot(raw: unknown): ValidationResult {
  const parsed = SnapshotSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    };
  }
  return { ok: true, snapshot: parsed.data };
}
