import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface CachedMeta {
  current: string;
  etag: string | null;
}

const META_FILE = "meta.json";

export async function readCachedMeta(cacheDir: string): Promise<CachedMeta | null> {
  try {
    const raw = await readFile(join(cacheDir, META_FILE), "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed?.current !== "string") return null;
    return { current: parsed.current, etag: parsed.etag ?? null };
  } catch {
    return null;
  }
}

export async function writeCachedSnapshot(
  cacheDir: string,
  snapshot: { version: string },
  etag: string | null,
): Promise<void> {
  await mkdir(cacheDir, { recursive: true });
  const fileName = `snapshot-${snapshot.version}.json`;
  await writeFile(join(cacheDir, fileName), JSON.stringify(snapshot), "utf8");
  await writeFile(
    join(cacheDir, META_FILE),
    JSON.stringify({ current: snapshot.version, etag }),
    "utf8",
  );
  const entries = await readdir(cacheDir);
  for (const name of entries) {
    if (name.startsWith("snapshot-") && name.endsWith(".json") && name !== fileName) {
      await unlink(join(cacheDir, name)).catch(() => {});
    }
  }
}

export async function loadCachedSnapshot(cacheDir: string): Promise<unknown | null> {
  const meta = await readCachedMeta(cacheDir);
  if (!meta) return null;
  const filePath = join(cacheDir, `snapshot-${meta.current}.json`);
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    await invalidateCache(cacheDir);
    return null;
  }
}

export async function invalidateCache(cacheDir: string): Promise<void> {
  try {
    const entries = await readdir(cacheDir);
    await Promise.all(entries.map((name) => unlink(join(cacheDir, name)).catch(() => {})));
  } catch {
    // dir didn't exist
  }
}
