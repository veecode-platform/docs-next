import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listDocs } from "../../../src/tools/list-docs.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("list_docs", () => {
  it("lists all docs at the top of a product", () => {
    const result = listDocs(snapshot, { product: "devportal" });
    expect("entries" in result).toBe(true);
    if ("entries" in result) {
      const paths = result.entries.filter((e) => e.type === "doc").map((e) => e.path);
      expect(paths).toContain("devportal/intro.md");
    }
  });

  it("returns directories with child_count when there are subdirs", () => {
    const result = listDocs(snapshot, { product: "devportal" });
    if ("entries" in result) {
      const dir = result.entries.find((e) => e.type === "dir");
      expect(dir).toMatchObject({ type: "dir", name: "integrations", child_count: 1 });
    }
  });

  it("filters by subpath", () => {
    const result = listDocs(snapshot, { product: "devportal", subpath: "integrations/" });
    if ("entries" in result) {
      expect(result.entries.every((e) => e.type !== "dir")).toBe(true);
      expect(result.entries[0]?.path).toBe("devportal/integrations/mcp.md");
    }
  });

  it("returns unknown_product when product is invalid", () => {
    const result = listDocs(snapshot, { product: "nope" });
    expect(result).toMatchObject({ error: "unknown_product" });
  });
});
