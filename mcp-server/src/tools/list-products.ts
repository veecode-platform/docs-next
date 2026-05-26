import type { Snapshot, ProductId } from "../schema.js";

export interface ProductSummary {
  id: ProductId;
  name: string;
  description: string;
  doc_count: number;
}

export function listProducts(snapshot: Snapshot): ProductSummary[] {
  return snapshot.products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    doc_count: p.docCount,
  }));
}
