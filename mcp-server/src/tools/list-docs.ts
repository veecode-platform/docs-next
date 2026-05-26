import type { Snapshot, ProductId } from "../schema.js";
import { unknownProduct, type StructuredError } from "../errors.js";

export type ListDocsEntry =
  | { type: "doc"; path: string; title: string }
  | { type: "dir"; path: string; name: string; child_count: number };

export interface ListDocsResult {
  product: ProductId;
  subpath: string;
  entries: ListDocsEntry[];
}

export interface ListDocsInput {
  product: string;
  subpath?: string;
}

function isProductId(snapshot: Snapshot, id: string): id is ProductId {
  return snapshot.products.some((p) => p.id === id);
}

export function listDocs(
  snapshot: Snapshot,
  input: ListDocsInput,
): ListDocsResult | StructuredError {
  if (!isProductId(snapshot, input.product)) {
    return unknownProduct(snapshot.products.map((p) => p.id));
  }
  const product = input.product;
  const subpathRaw = input.subpath ?? "";
  const subpath = subpathRaw.endsWith("/") || subpathRaw === "" ? subpathRaw : `${subpathRaw}/`;
  const prefix = `${product}/${subpath}`;

  const docsInScope = snapshot.docs.filter((d) => d.path.startsWith(prefix));
  const entries: ListDocsEntry[] = [];
  const seenDirs = new Map<string, number>();

  for (const d of docsInScope) {
    const rest = d.path.slice(prefix.length);
    const slashIdx = rest.indexOf("/");
    if (slashIdx === -1) {
      entries.push({ type: "doc", path: d.path, title: d.title });
    } else {
      const dirName = rest.slice(0, slashIdx);
      seenDirs.set(dirName, (seenDirs.get(dirName) ?? 0) + 1);
    }
  }
  for (const [name, child_count] of seenDirs) {
    entries.push({
      type: "dir",
      path: `${prefix}${name}/`,
      name,
      child_count,
    });
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));

  return { product, subpath, entries };
}
