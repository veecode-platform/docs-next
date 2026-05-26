import { readFile } from "node:fs/promises";
import { validateSnapshot } from "./validate.js";
import {
  loadCachedSnapshot,
  readCachedMeta,
  writeCachedSnapshot,
  invalidateCache,
} from "./cache.js";
import { fetchIfNewer } from "./fetcher.js";
import type { Snapshot } from "../schema.js";

export type LoadSource = "bundled" | "cache";
export type RefreshStatus =
  | "pending"
  | "up-to-date"
  | "newer-downloaded"
  | "offline"
  | "disabled"
  | "failed";

export interface LoadResult {
  snapshot: Snapshot;
  source: LoadSource;
  bundledVersion: string;
  refreshStatus: RefreshStatus;
  refreshPromise: Promise<RefreshStatus>;
}

export interface LoadOptions {
  bundledPath: string;
  offline?: boolean;
  cacheDir?: string | null;
  remoteUrl?: string | null;
}

async function readBundled(path: string): Promise<Snapshot> {
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch (err) {
    throw new Error(`bundled snapshot (${path}) could not be read: ${(err as Error).message}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`bundled snapshot (${path}) is not valid JSON: ${(err as Error).message}`);
  }
  const result = validateSnapshot(parsed);
  if (!result.ok) throw new Error(`bundled snapshot failed validation: ${result.error}`);
  return result.snapshot;
}

export async function loadSnapshot(opts: LoadOptions): Promise<LoadResult> {
  const bundled = await readBundled(opts.bundledPath);

  let active: Snapshot = bundled;
  let source: LoadSource = "bundled";

  if (opts.cacheDir) {
    const cachedRaw = await loadCachedSnapshot(opts.cacheDir);
    if (cachedRaw) {
      const validated = validateSnapshot(cachedRaw);
      if (validated.ok && validated.snapshot.generatedAt > bundled.generatedAt) {
        active = validated.snapshot;
        source = "cache";
      } else if (!validated.ok) {
        await invalidateCache(opts.cacheDir);
      }
    }
  }

  const refreshPromise: Promise<RefreshStatus> = opts.offline
    ? Promise.resolve("disabled")
    : !opts.remoteUrl || !opts.cacheDir
    ? Promise.resolve("disabled")
    : runRefresh(opts.remoteUrl, opts.cacheDir);

  return {
    snapshot: active,
    source,
    bundledVersion: bundled.version,
    refreshStatus: opts.offline ? "disabled" : "pending",
    refreshPromise,
  };
}

async function runRefresh(url: string, cacheDir: string): Promise<RefreshStatus> {
  const meta = await readCachedMeta(cacheDir);
  const outcome = await fetchIfNewer({ url, cachedEtag: meta?.etag ?? null });
  switch (outcome.status) {
    case "up-to-date":
      return "up-to-date";
    case "offline":
      return "offline";
    case "failed":
      return "failed";
    case "newer": {
      const validated = validateSnapshot(outcome.snapshot);
      if (!validated.ok) return "failed";
      await writeCachedSnapshot(cacheDir, validated.snapshot, outcome.etag);
      return "newer-downloaded";
    }
  }
}
