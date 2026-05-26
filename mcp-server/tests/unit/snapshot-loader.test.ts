import { describe, it, expect } from "vitest";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSnapshot } from "../../src/snapshot/loader.js";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(here, "..", "fixtures", "snapshot.json");

describe("loadSnapshot (bundled only)", () => {
  it("returns the parsed snapshot and reports source=bundled", async () => {
    const result = await loadSnapshot({ bundledPath: fixturePath, offline: true });
    expect(result.source).toBe("bundled");
    expect(result.snapshot.version).toMatch(/^\d{4}\.\d{2}\.\d{2}-/);
    expect(result.snapshot.docs).toHaveLength(2);
  });

  it("rejects when the bundled file does not exist", async () => {
    await expect(
      loadSnapshot({ bundledPath: "/nonexistent.json", offline: true }),
    ).rejects.toThrow(/bundled snapshot/i);
  });

  it("rejects when the bundled file fails schema validation", async () => {
    const badDir = mkdtempSync(join(tmpdir(), "mcp-loader-bad-"));
    const bad = join(badDir, "bad-snapshot.json");
    writeFileSync(bad, JSON.stringify({ version: "bad" }));
    await expect(loadSnapshot({ bundledPath: bad, offline: true })).rejects.toThrow(
      /validation/i,
    );
  });
});
