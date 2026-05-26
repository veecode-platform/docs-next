import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocOutline } from "../../../src/tools/get-doc-outline.js";
import type { Snapshot } from "../../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot: Snapshot = JSON.parse(
  readFileSync(join(here, "..", "..", "fixtures", "snapshot.json"), "utf8"),
);

describe("get_doc_outline", () => {
  it("returns outline + frontmatter without section content", () => {
    const result = getDocOutline(snapshot, { path: "devportal/integrations/mcp.md" });
    expect(result).toMatchObject({
      path: "devportal/integrations/mcp.md",
      title: "MCP Integration",
      outline: [
        { depth: 2, title: "For platform teams", anchor: "for-platform-teams" },
        { depth: 2, title: "Self-hosted (dynamic plugin config)", anchor: "self-hosted-dynamic-plugin-config" },
      ],
    });
    expect("sections" in result).toBe(false);
    expect("content" in result).toBe(false);
  });

  it("returns not_found with a suggestion for a near-miss path", () => {
    const result = getDocOutline(snapshot, { path: "devportal/integratons/mcp.md" });
    expect(result).toMatchObject({
      error: "not_found",
      suggestion: "devportal/integrations/mcp.md",
    });
  });
});
