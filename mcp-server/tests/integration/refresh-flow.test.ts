import { describe, it, expect, beforeEach, vi } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSnapshot } from "../../src/snapshot/loader.js";

const validBundled = {
  version: "2026.05.10-aaaaaaa",
  generatedAt: "2026-05-10T00:00:00Z",
  products: [
    { id: "devportal", name: "DevPortal", description: "x", docCount: 0 },
    { id: "platform", name: "Platform", description: "x", docCount: 0 },
    { id: "admin-ui", name: "Admin-UI", description: "x", docCount: 0 },
    { id: "vkdr", name: "VKDR-CLI", description: "x", docCount: 0 },
  ],
  docs: [],
};

const newerRemote = { ...validBundled, version: "2026.05.25-bbbbbbb", generatedAt: "2026-05-25T00:00:00Z" };

describe("loadSnapshot refresh integration", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("downloads newer remote and persists to cache for next launch", async () => {
    const dir = await mkdtemp(join(tmpdir(), "veecode-mcp-int-"));
    const bundledPath = join(dir, "bundled.json");
    const cacheDir = join(dir, "cache");
    await writeFile(bundledPath, JSON.stringify(validBundled));

    let getCalled = false;
    vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
      if ((opts?.method ?? "GET") === "HEAD") {
        return new Response(null, { status: 200, headers: { etag: '"new"' } });
      }
      getCalled = true;
      return new Response(JSON.stringify(newerRemote), {
        status: 200,
        headers: { etag: '"new"' },
      });
    }));

    const result = await loadSnapshot({
      bundledPath,
      cacheDir,
      remoteUrl: "https://example.test/mcp-snapshot.json",
    });

    expect(result.source).toBe("bundled");
    expect(result.snapshot.version).toBe(validBundled.version);
    const refresh = await result.refreshPromise;
    expect(refresh).toBe("newer-downloaded");
    expect(getCalled).toBe(true);
  });

  it("falls back silently to bundled when offline", async () => {
    const dir = await mkdtemp(join(tmpdir(), "veecode-mcp-int-"));
    const bundledPath = join(dir, "bundled.json");
    const cacheDir = join(dir, "cache");
    await writeFile(bundledPath, JSON.stringify(validBundled));

    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));

    const result = await loadSnapshot({
      bundledPath,
      cacheDir,
      remoteUrl: "https://example.test/mcp-snapshot.json",
    });
    const refresh = await result.refreshPromise;
    expect(refresh).toBe("offline");
    expect(result.snapshot.version).toBe(validBundled.version);
  });
});
