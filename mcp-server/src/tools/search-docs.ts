import type { Snapshot, ProductId } from "../schema.js";
import type { SearchHit, SearchIndex } from "../search/index.js";

export interface SearchDocsInput {
  query: string;
  product?: ProductId;
  limit?: number;
}

export type SearchDocsResult =
  | SearchHit[]
  | { results: []; hint: string };

export function searchDocs(
  snapshot: Snapshot,
  index: SearchIndex,
  input: SearchDocsInput,
): SearchDocsResult {
  const hits = index.search(input.query, {
    product: input.product,
    limit: input.limit,
  });
  if (hits.length === 0) {
    return {
      results: [],
      hint: `no matches for "${input.query}". Try broader terms; available products: ${snapshot.products.map((p) => p.id).join(", ")}.`,
    };
  }
  return hits;
}
