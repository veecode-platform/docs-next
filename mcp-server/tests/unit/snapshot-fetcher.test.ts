import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchIfNewer, type FetchOutcome } from "../../src/snapshot/fetcher.js";

describe("fetchIfNewer", () => {
  const url = "https://example.test/mcp-snapshot.json";
  beforeEach(() => vi.restoreAllMocks());

  it("returns up-to-date when remote ETag matches cached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, {
      status: 200,
      headers: { etag: '"v1"' },
    })));
    const result: FetchOutcome = await fetchIfNewer({ url, cachedEtag: '"v1"' });
    expect(result.status).toBe("up-to-date");
  });

  it("returns newer with snapshot + etag when remote differs", async () => {
    const body = JSON.stringify({ version: "x", products: [], docs: [] });
    vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
      if ((opts?.method ?? "GET") === "HEAD") {
        return new Response(null, { status: 200, headers: { etag: '"v2"' } });
      }
      return new Response(body, { status: 200, headers: { etag: '"v2"' } });
    }));
    const result = await fetchIfNewer({ url, cachedEtag: '"v1"' });
    expect(result.status).toBe("newer");
    if (result.status === "newer") {
      expect(result.etag).toBe('"v2"');
      expect(result.snapshot).toEqual(JSON.parse(body));
    }
  });

  it("returns offline when HEAD throws", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));
    const result = await fetchIfNewer({ url, cachedEtag: null });
    expect(result.status).toBe("offline");
  });

  it("returns failed when GET throws after HEAD succeeds", async () => {
    let call = 0;
    vi.stubGlobal("fetch", vi.fn(async () => {
      call++;
      if (call === 1) return new Response(null, { status: 200, headers: { etag: '"x"' } });
      throw new Error("get failed");
    }));
    const result = await fetchIfNewer({ url, cachedEtag: null });
    expect(result.status).toBe("failed");
  });

  it("returns failed when body read exceeds the timeout", async () => {
    // HEAD succeeds, GET resolves quickly but .json() hangs forever
    vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
      if ((opts?.method ?? "GET") === "HEAD") {
        return new Response(null, { status: 200, headers: { etag: '"x"' } });
      }
      // Create a Response whose .json() never resolves
      return {
        ok: true,
        status: 200,
        headers: { get: () => '"x"' } as unknown as Headers,
        json: () => new Promise(() => {}),  // never resolves
      } as unknown as Response;
    }));
    const result = await fetchIfNewer({ url, cachedEtag: null, timeoutMs: 50 });
    expect(result.status).toBe("failed");
    if (result.status === "failed") {
      expect(result.reason).toMatch(/body read/i);
    }
  });
});
