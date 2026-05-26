import type { Snapshot, OutlineEntry } from "../schema.js";
import { notFound, type StructuredError } from "../errors.js";
import { suggestPath } from "../search/fuzzy-path.js";

export interface OutlineResult {
  path: string;
  product: string;
  title: string;
  sidebar_label?: string;
  frontmatter: Record<string, unknown>;
  outline: OutlineEntry[];
}

export function getDocOutline(
  snapshot: Snapshot,
  input: { path: string },
): OutlineResult | StructuredError {
  const doc = snapshot.docs.find((d) => d.path === input.path);
  if (!doc) {
    const suggestion = suggestPath(input.path, snapshot.docs.map((d) => d.path));
    return notFound(suggestion);
  }
  return {
    path: doc.path,
    product: doc.product,
    title: doc.title,
    sidebar_label: doc.sidebarLabel,
    frontmatter: doc.frontmatter,
    outline: doc.outline,
  };
}
