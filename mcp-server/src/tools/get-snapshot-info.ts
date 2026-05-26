import type { Snapshot } from "../schema.js";
import type { LoadSource, RefreshStatus } from "../snapshot/loader.js";

export interface SnapshotInfoInput {
  snapshot: Snapshot;
  source: LoadSource;
  bundledVersion: string;
  refreshStatus: RefreshStatus;
}

export interface SnapshotInfo {
  version: string;
  generated_at: string;
  source: LoadSource;
  bundled_version: string;
  doc_count: number;
  section_count: number;
  refresh_status: RefreshStatus;
}

export function getSnapshotInfo(input: SnapshotInfoInput): SnapshotInfo {
  const section_count = input.snapshot.docs.reduce((n, d) => n + d.sections.length, 0);
  return {
    version: input.snapshot.version,
    generated_at: input.snapshot.generatedAt,
    source: input.source,
    bundled_version: input.bundledVersion,
    doc_count: input.snapshot.docs.length,
    section_count,
    refresh_status: input.refreshStatus,
  };
}
