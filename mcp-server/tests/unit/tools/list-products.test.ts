import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listProducts } from "../../../src/tools/list-products.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("list_products", () => {
  it("returns the four products with id, name, description, doc_count", () => {
    const result = listProducts(snapshot);
    expect(result).toHaveLength(4);
    const devportal = result.find((p) => p.id === "devportal");
    expect(devportal).toMatchObject({
      id: "devportal",
      name: "DevPortal",
      doc_count: 2,
    });
    expect(typeof devportal?.description).toBe("string");
  });
});
