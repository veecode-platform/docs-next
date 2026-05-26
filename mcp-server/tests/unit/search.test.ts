import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIndex } from "../../src/search/index.js";
import type { Snapshot } from "../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("buildIndex / search", () => {
  it("finds the MCP section by its title keywords", () => {
    const index = buildIndex(snapshot);
    const results = index.search("dynamic plugin config");
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top?.path).toBe("devportal/integrations/mcp.md");
    expect(top?.anchor).toBe("self-hosted-dynamic-plugin-config");
  });

  it("filters by product", () => {
    const index = buildIndex(snapshot);
    const results = index.search("overview", { product: "platform" });
    expect(results.every((r) => r.product === "platform")).toBe(true);
  });

  it("limits results", () => {
    const index = buildIndex(snapshot);
    const results = index.search("the", { limit: 1 });
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it("returns an empty array (not throw) for queries with no matches", () => {
    const index = buildIndex(snapshot);
    expect(index.search("xyzzy-no-match")).toEqual([]);
  });

  it("produces snippets that contain the matched section content", () => {
    const index = buildIndex(snapshot);
    const hits = index.search("dynamic-plugins.yaml");
    const hit = hits[0];
    expect(hit?.snippet).toMatch(/dynamic-plugins\.yaml/);
  });
});
