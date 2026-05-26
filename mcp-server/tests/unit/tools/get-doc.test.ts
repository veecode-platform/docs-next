import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDoc } from "../../../src/tools/get-doc.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const baseSnapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

// Build an augmented snapshot with an H3 inside the parent H2 for slicing tests
function snapshotWithH3(): Snapshot {
  const clone = JSON.parse(JSON.stringify(baseSnapshot)) as Snapshot;
  const doc = clone.docs.find((d) => d.path === "devportal/integrations/mcp.md")!;
  doc.outline.push({ depth: 3, title: "SaaS portal", anchor: "saas-portal" });
  // Inject H3 + body into the last H2 section's content (the parent H2 for the H3)
  const last = doc.sections[doc.sections.length - 1]!;
  last.content = last.content + "\n\n### SaaS portal\n\nGo to Configure → Integrations.";
  return clone;
}

describe("get_doc", () => {
  it("without anchor returns the full doc content", () => {
    const result = getDoc(baseSnapshot, { path: "devportal/integrations/mcp.md" });
    if ("error" in result) throw new Error("unexpected error");
    expect("content" in result).toBe(true);
    if ("content" in result) {
      expect(result.content).toContain("For platform teams");
      expect(result.content).toContain("Self-hosted");
    }
  });

  it("with a valid anchor returns just that section", () => {
    const result = getDoc(baseSnapshot, {
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
    const result = getDoc(baseSnapshot, {
      path: "devportal/integrations/mcp.md",
      anchor: "no-such-anchor",
    });
    if ("error" in result) throw new Error("unexpected error");
    expect("content" in result).toBe(true);
    expect(result.warning).toMatch(/anchor not found/i);
  });

  it("returns not_found with suggestion when path is unknown", () => {
    const result = getDoc(baseSnapshot, { path: "devportal/intergrations/mcp.md" });
    expect(result).toMatchObject({
      error: "not_found",
      suggestion: "devportal/integrations/mcp.md",
    });
  });

  it("slices a parent section when anchor matches an H3 in the outline", () => {
    const snapshot = snapshotWithH3();
    const result = getDoc(snapshot, {
      path: "devportal/integrations/mcp.md",
      anchor: "saas-portal",
    });
    if ("error" in result) throw new Error("unexpected error");
    expect("section" in result).toBe(true);
    if ("section" in result) {
      expect(result.section.anchor).toBe("saas-portal");
      expect(result.section.content).toMatch(/^### SaaS portal/);
      expect(result.section.content).toContain("Configure → Integrations");
    }
  });
});
