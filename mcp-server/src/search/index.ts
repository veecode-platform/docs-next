import MiniSearch from "minisearch";
import type { Snapshot, ProductId } from "../schema.js";

export interface SearchHit {
  path: string;
  anchor: string;
  product: ProductId;
  doc_title: string;
  section_title: string;
  snippet: string;
  score: number;
}

export interface SearchOptions {
  product?: ProductId;
  limit?: number;
}

interface IndexedDoc {
  id: string;
  path: string;
  anchor: string;
  product: ProductId;
  doc_title: string;
  section_title: string;
  content: string;
}

const SNIPPET_MAX = 200;

function makeSnippet(content: string, query: string): string {
  const lower = content.toLowerCase();
  const needle = query.toLowerCase().split(/\s+/)[0];
  if (!needle) return content.slice(0, SNIPPET_MAX);
  const idx = lower.indexOf(needle);
  if (idx === -1) return content.slice(0, SNIPPET_MAX);
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + SNIPPET_MAX - 40);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + content.slice(start, end) + suffix;
}

export interface SearchIndex {
  search(query: string, opts?: SearchOptions): SearchHit[];
}

export function buildIndex(snapshot: Snapshot): SearchIndex {
  const docs: IndexedDoc[] = [];
  for (const doc of snapshot.docs) {
    for (const section of doc.sections) {
      docs.push({
        id: `${doc.path}#${section.anchor}`,
        path: doc.path,
        anchor: section.anchor,
        product: doc.product,
        doc_title: doc.title,
        section_title: section.title,
        content: section.content,
      });
    }
  }

  const mini = new MiniSearch<IndexedDoc>({
    fields: ["section_title", "content", "doc_title"],
    storeFields: [
      "path",
      "anchor",
      "product",
      "doc_title",
      "section_title",
      "content",
    ],
    searchOptions: {
      boost: { doc_title: 3, section_title: 2, content: 1 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  mini.addAll(docs);

  return {
    search(query, opts = {}) {
      const limit = opts.limit ?? 10;
      let hits = mini.search(query);
      if (opts.product) {
        hits = hits.filter((h) => (h as unknown as IndexedDoc).product === opts.product);
      }
      return hits.slice(0, limit).map((h) => {
        const doc = h as unknown as IndexedDoc & { score: number };
        return {
          path: doc.path,
          anchor: doc.anchor,
          product: doc.product,
          doc_title: doc.doc_title,
          section_title: doc.section_title,
          snippet: makeSnippet(doc.content, query),
          score: doc.score,
        };
      });
    },
  };
}
