import { readFile } from "node:fs/promises";
import { validateSnapshot } from "./validate.js";
import type { Snapshot } from "../schema.js";

export type LoadSource = "bundled" | "cache";
export type RefreshStatus =
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
}

export interface LoadOptions {
  bundledPath: string;
  offline?: boolean;
}

async function readJson(path: string, label: string): Promise<unknown> {
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch (err) {
    throw new Error(`${label} (${path}) could not be read: ${(err as Error).message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`${label} (${path}) is not valid JSON: ${(err as Error).message}`);
  }
}

export async function loadSnapshot(opts: LoadOptions): Promise<LoadResult> {
  const bundledRaw = await readJson(opts.bundledPath, "bundled snapshot");
  const bundledResult = validateSnapshot(bundledRaw);
  if (!bundledResult.ok) {
    throw new Error(`bundled snapshot failed validation: ${bundledResult.error}`);
  }
  const bundled = bundledResult.snapshot;

  // Bundled-only; cache + remote are added in T10.
  return {
    snapshot: bundled,
    source: "bundled",
    bundledVersion: bundled.version,
    refreshStatus: opts.offline ? "disabled" : "offline",
  };
}
