import { describe, it, expect } from "vitest";
import { suggestPath } from "../../src/search/fuzzy-path.js";

describe("suggestPath", () => {
  const all = [
    "devportal/intro.md",
    "devportal/integrations/mcp.md",
    "devportal/plugins/grafana.md",
    "platform/intro.md",
  ];

  it("returns the closest match by edit distance", () => {
    expect(suggestPath("devportal/intergrations/mcp.md", all)).toBe(
      "devportal/integrations/mcp.md",
    );
  });

  it("returns null when nothing is close enough", () => {
    expect(suggestPath("totally/different/path.md", all)).toBeNull();
  });
});
