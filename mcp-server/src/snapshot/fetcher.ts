export type FetchOutcome =
  | { status: "up-to-date" }
  | { status: "newer"; snapshot: unknown; etag: string | null }
  | { status: "offline" }
  | { status: "failed"; reason: string };

export interface FetcherInput {
  url: string;
  cachedEtag: string | null;
  timeoutMs?: number;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function fetchIfNewer(input: FetcherInput): Promise<FetchOutcome> {
  const timeout = input.timeoutMs ?? 5_000;

  let headRes: Response;
  try {
    headRes = await withTimeout(fetch(input.url, { method: "HEAD" }), timeout);
  } catch {
    return { status: "offline" };
  }
  if (!headRes.ok) return { status: "failed", reason: `HEAD ${headRes.status}` };

  const remoteEtag = headRes.headers.get("etag");
  if (remoteEtag && input.cachedEtag && remoteEtag === input.cachedEtag) {
    return { status: "up-to-date" };
  }

  let getRes: Response;
  try {
    getRes = await withTimeout(fetch(input.url, { method: "GET" }), timeout);
  } catch (err) {
    return { status: "failed", reason: `GET threw: ${(err as Error).message}` };
  }
  if (!getRes.ok) return { status: "failed", reason: `GET ${getRes.status}` };

  let snapshot: unknown;
  try {
    snapshot = await withTimeout(getRes.json(), timeout);
  } catch (err) {
    return { status: "failed", reason: `body read: ${(err as Error).message}` };
  }
  return { status: "newer", snapshot, etag: getRes.headers.get("etag") };
}
