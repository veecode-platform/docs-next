import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { searchDocs } from "../../../src/tools/search-docs.js";
import { buildIndex } from "../../../src/search/index.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("search_docs", () => {
  it("returns ranked section hits with snippets", () => {
    const index = buildIndex(snapshot);
    const result = searchDocs(snapshot, index, { query: "dynamic plugin config" });
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result[0]).toMatchObject({
        path: "devportal/integrations/mcp.md",
        anchor: "self-hosted-dynamic-plugin-config",
      });
    }
  });

  it("returns hint when there are zero matches", () => {
    const index = buildIndex(snapshot);
    const result = searchDocs(snapshot, index, { query: "xyzzy-no-match" });
    expect(result).toMatchObject({ hint: expect.any(String), results: [] });
  });

  it("respects the limit parameter", () => {
    const index = buildIndex(snapshot);
    const result = searchDocs(snapshot, index, { query: "the", limit: 1 });
    if (Array.isArray(result)) expect(result.length).toBeLessThanOrEqual(1);
  });
});
