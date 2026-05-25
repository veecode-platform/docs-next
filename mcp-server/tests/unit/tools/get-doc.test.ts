import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDoc } from "../../../src/tools/get-doc.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("get_doc", () => {
  it("without anchor returns the full doc content", () => {
    const result = getDoc(snapshot, { path: "devportal/integrations/mcp.md" });
    if ("error" in result) throw new Error("unexpected error");
    expect("content" in result).toBe(true);
    if ("content" in result) {
      expect(result.content).toContain("For platform teams");
      expect(result.content).toContain("Self-hosted");
    }
  });

  it("with a valid anchor returns just that section", () => {
    const result = getDoc(snapshot, {
      path: "devportal/integrations/mcp.md",
      anchor: "self-hosted-dynamic-plugin-config",
    });
    if ("error" in result) throw new Error("unexpected error");
    expect("section" in result).toBe(true);
    if ("section" in result) {
      expect(result.section.anchor).toBe("self-hosted-dynamic-plugin-config");
      expect(result.section.content).toContain("dynamic-plugins.yaml");
    }
  });

  it("with an unknown anchor returns the full doc + warning", () => {
    const result = getDoc(snapshot, {
      path: "devportal/integrations/mcp.md",
      anchor: "no-such-anchor",
    });
    if ("error" in result) throw new Error("unexpected error");
    expect("content" in result).toBe(true);
    expect(result.warning).toMatch(/anchor not found/i);
  });

  it("returns not_found with suggestion when path is unknown", () => {
    const result = getDoc(snapshot, { path: "devportal/intergrations/mcp.md" });
    expect(result).toMatchObject({
      error: "not_found",
      suggestion: "devportal/integrations/mcp.md",
    });
  });
});
