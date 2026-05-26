import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { SnapshotSchema } from "../../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, "..", "..", "..", "schemas", "mcp-snapshot.schema.json");

describe("emitted JSON Schema", () => {
  it("matches the current zod schema (run `yarn emit-schema` if this fails)", () => {
    const onDisk = JSON.parse(readFileSync(schemaPath, "utf8"));
    const fresh = zodToJsonSchema(SnapshotSchema, {
      name: "Snapshot",
      $refStrategy: "none",
    });
    expect(onDisk).toEqual(fresh);
  });
});
