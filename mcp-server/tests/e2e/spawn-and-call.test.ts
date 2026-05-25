import { describe, it, expect, beforeAll } from "vitest";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { copyFile, mkdir } from "node:fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..");
const distEntry = join(repoRoot, "mcp-server", "dist", "index.js");
const fixturePath = join(here, "..", "fixtures", "snapshot.json");
const bundledTargetPath = join(repoRoot, "mcp-server", "bundled", "snapshot.json");

describe("e2e: spawn binary and call tools", () => {
  beforeAll(async () => {
    await mkdir(dirname(bundledTargetPath), { recursive: true });
    await copyFile(fixturePath, bundledTargetPath);
  }, 30_000);

  it("answers list_products via real stdio", async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [distEntry],
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            (entry): entry is [string, string] => entry[1] !== undefined,
          ),
        ),
        VEECODE_DOCS_MCP_OFFLINE: "1",
      },
    });
    const client = new Client({ name: "e2e", version: "0.0.0" }, { capabilities: {} });
    await client.connect(transport);

    const result = await client.callTool({ name: "list_products", arguments: {} });
    const content = result.content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(content[0]!.text);
    expect(parsed).toHaveLength(4);

    await client.close();
  }, 30_000);
});
