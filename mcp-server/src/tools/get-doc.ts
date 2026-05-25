import type { Snapshot, OutlineEntry, Section } from "../schema.js";
import { notFound, type StructuredError } from "../errors.js";
import { suggestPath } from "../search/fuzzy-path.js";

interface DocBase {
  path: string;
  product: string;
  title: string;
  sidebar_label?: string;
  frontmatter: Record<string, unknown>;
  outline: OutlineEntry[];
  warning?: string;
}

export type GetDocResult =
  | (DocBase & { content: string })
  | (DocBase & { section: Section });

export interface GetDocInput {
  path: string;
  anchor?: string;
}

export function getDoc(
  snapshot: Snapshot,
  input: GetDocInput,
): GetDocResult | StructuredError {
  const doc = snapshot.docs.find((d) => d.path === input.path);
  if (!doc) {
    const suggestion = suggestPath(input.path, snapshot.docs.map((d) => d.path));
    return notFound(suggestion);
  }

  const base: DocBase = {
    path: doc.path,
    product: doc.product,
    title: doc.title,
    sidebar_label: doc.sidebarLabel,
    frontmatter: doc.frontmatter,
    outline: doc.outline,
  };

  if (input.anchor) {
    const section = doc.sections.find((s) => s.anchor === input.anchor);
    if (section) return { ...base, section };
    return {
      ...base,
      warning: `anchor not found: ${input.anchor}; returning full doc`,
      content: doc.sections.map((s) => s.content).join("\n\n"),
    };
  }

  return {
    ...base,
    content: doc.sections.map((s) => s.content).join("\n\n"),
  };
}
