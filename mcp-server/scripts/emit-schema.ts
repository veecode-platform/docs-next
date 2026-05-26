import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { SnapshotSchema } from "../src/schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "..", "schemas", "mcp-snapshot.schema.json");

const jsonSchema = zodToJsonSchema(SnapshotSchema, {
  name: "Snapshot",
  $refStrategy: "none",
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2) + "\n", "utf8");

console.log(`Wrote ${outPath}`);
