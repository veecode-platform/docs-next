import { describe, it, expect, beforeEach } from "vitest";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readCachedMeta,
  writeCachedSnapshot,
  loadCachedSnapshot,
} from "../../src/snapshot/cache.js";

describe("snapshot cache", () => {
  let cacheDir: string;
  beforeEach(async () => {
    cacheDir = await mkdtemp(join(tmpdir(), "veecode-mcp-cache-"));
  });

  it("returns null when no meta.json exists yet", async () => {
    expect(await readCachedMeta(cacheDir)).toBeNull();
  });

  it("writes a snapshot file and updates meta.json", async () => {
    const snap = { version: "2026.05.25-aaaaaaa", generatedAt: "2026-05-25T00:00:00Z", products: [], docs: [] };
    await writeCachedSnapshot(cacheDir, snap, '"etag-1"');
    const meta = await readCachedMeta(cacheDir);
    expect(meta).toEqual({ current: "2026.05.25-aaaaaaa", etag: '"etag-1"' });
    const fileText = await readFile(join(cacheDir, "snapshot-2026.05.25-aaaaaaa.json"), "utf8");
    expect(JSON.parse(fileText).version).toBe("2026.05.25-aaaaaaa");
  });

  it("removes the previous snapshot when writing a new one", async () => {
    const s1 = { version: "2026.05.25-aaaaaaa", generatedAt: "2026-05-25T00:00:00Z", products: [], docs: [] };
    const s2 = { version: "2026.05.26-bbbbbbb", generatedAt: "2026-05-26T00:00:00Z", products: [], docs: [] };
    await writeCachedSnapshot(cacheDir, s1, '"e1"');
    await writeCachedSnapshot(cacheDir, s2, '"e2"');
    const meta = await readCachedMeta(cacheDir);
    expect(meta?.current).toBe("2026.05.26-bbbbbbb");
    await expect(
      readFile(join(cacheDir, "snapshot-2026.05.25-aaaaaaa.json"), "utf8"),
    ).rejects.toThrow();
  });

  it("loadCachedSnapshot returns null when meta is missing", async () => {
    expect(await loadCachedSnapshot(cacheDir)).toBeNull();
  });

  it("loadCachedSnapshot returns null and self-heals on corrupted file", async () => {
    await writeFile(join(cacheDir, "meta.json"), '{"current":"x","etag":"y"}', "utf8");
    await writeFile(join(cacheDir, "snapshot-x.json"), "not json", "utf8");
    expect(await loadCachedSnapshot(cacheDir)).toBeNull();
    expect(await readCachedMeta(cacheDir)).toBeNull();
  });
});
