import { describe, it, expect } from "vitest";
import plugin from "../index.js";

describe("mcp-snapshot plugin", () => {
  it("returns a Docusaurus plugin object with name and postBuild", () => {
    const result = plugin({}, {});
    expect(result).toMatchObject({ name: "mcp-snapshot" });
    expect(typeof result.postBuild).toBe("function");
  });
});
