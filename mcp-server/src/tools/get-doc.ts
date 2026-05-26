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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Slice the markdown body of a parent H2 section starting at the heading whose
 * slug matches `anchor` at `depth`, ending at the next heading of equal-or-shallower depth.
 */
function sliceByHeading(
  parentContent: string,
  anchor: string,
  depth: number,
): string | null {
  const lines = parentContent.split("\n");
  const hashes = "#".repeat(depth);
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith(`${hashes} `)) {
      const title = line.slice(hashes.length + 1).trim();
      if (slugify(title) === anchor) {
        startIdx = i;
        break;
      }
    }
  }
  if (startIdx === -1) return null;

  let endIdx = lines.length;
  const headingPattern = /^(#{1,6})\s/;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const m = headingPattern.exec(line);
    if (m && m[1] && m[1].length <= depth) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx, endIdx).join("\n").trim();
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
    // 1. Direct H2 section match
    const section = doc.sections.find((s) => s.anchor === input.anchor);
    if (section) return { ...base, section };

    // 2. H3/H4+ anchor advertised by outline → slice parent section content
    const outlineEntry = doc.outline.find((o) => o.anchor === input.anchor);
    if (outlineEntry && outlineEntry.depth >= 3) {
      // Find the parent H2 section: walk back through outline to most recent depth=2
      const idx = doc.outline.indexOf(outlineEntry);
      let parentAnchor: string | undefined;
      for (let i = idx - 1; i >= 0; i--) {
        const e = doc.outline[i];
        if (e && e.depth === 2) {
          parentAnchor = e.anchor;
          break;
        }
      }
      // Handle the case where the lede contains the H3 (no preceding H2 in outline)
      const parentSection = parentAnchor
        ? doc.sections.find((s) => s.anchor === parentAnchor)
        : doc.sections.find((s) => s.anchor === "");
      if (parentSection) {
        const sliced = sliceByHeading(parentSection.content, input.anchor, outlineEntry.depth);
        if (sliced) {
          return {
            ...base,
            section: {
              anchor: input.anchor,
              title: outlineEntry.title,
              depth: 2,            // schema locks depth to 2 — keep the type stable
              content: sliced,
              tokens: Math.ceil(sliced.length / 4),
            },
          };
        }
      }
    }

    // 3. Unknown anchor → full doc + warning
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
