import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const distEntry = "/home/gio/projetos/docs/mcp-server/dist/index.js";

const sanitizeEnv = () =>
  Object.fromEntries(
    Object.entries(process.env).filter(([, v]) => v !== undefined),
  );

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [distEntry],
  env: {
    ...sanitizeEnv(),
    VEECODE_DOCS_MCP_OFFLINE: "1",
  },
});

const client = new Client(
  { name: "smoke-test", version: "0.0.0" },
  { capabilities: {} },
);

await client.connect(transport);

const log = (label, val) => {
  console.log(`\n━━━ ${label} ━━━`);
  console.log(typeof val === "string" ? val : JSON.stringify(val, null, 2).slice(0, 800));
};

const callTool = async (name, args = {}) => {
  const res = await client.callTool({ name, arguments: args });
  return JSON.parse(res.content[0].text);
};

// 1. listTools (handshake validation)
const tools = await client.listTools();
log("1. listTools", tools.tools.map((t) => t.name).sort());

// 2. get_snapshot_info
log("2. get_snapshot_info", await callTool("get_snapshot_info"));

// 3. list_products
log("3. list_products", await callTool("list_products"));

// 4. list_docs (devportal top level)
log("4. list_docs devportal", await callTool("list_docs", { product: "devportal" }));

// 5. list_docs with subpath (devportal/plugins)
log("5. list_docs devportal/plugins/", await callTool("list_docs", { product: "devportal", subpath: "plugins/" }));

// 6. search_docs — common agent query
log("6. search_docs 'how to add a custom plugin'", await callTool("search_docs", { query: "how to add a custom plugin", limit: 3 }));

// 7. search_docs — technical config term
log("7. search_docs 'dynamic-plugins.yaml'", await callTool("search_docs", { query: "dynamic-plugins.yaml", limit: 3 }));

// 8. search_docs — VKDR specific
log("8. search_docs 'vkdr install'", await callTool("search_docs", { query: "vkdr install", product: "vkdr", limit: 3 }));

// 9. get_doc_outline of a known file
log("9. get_doc_outline devportal/integrations/mcp.md", await callTool("get_doc_outline", { path: "devportal/integrations/mcp.md" }));

// 10. get_doc with anchor (H2)
const docByAnchor = await callTool("get_doc", { path: "devportal/integrations/mcp.md", anchor: "for-platform-teams" });
log("10. get_doc H2 anchor 'for-platform-teams'", {
  path: docByAnchor.path,
  title: docByAnchor.title,
  section: docByAnchor.section ? { anchor: docByAnchor.section.anchor, content_preview: docByAnchor.section.content.slice(0, 200) + "…" } : "no section",
});

// 11. get_doc full doc (no anchor)
const fullDoc = await callTool("get_doc", { path: "devportal/integrations/mcp.md" });
log("11. get_doc full doc length", {
  path: fullDoc.path,
  content_chars: fullDoc.content?.length,
  outline_entries: fullDoc.outline.length,
});

// 12. get_doc with fuzzy path miss (error path)
log("12. get_doc fuzzy not-found", await callTool("get_doc", { path: "devportal/integratons/mcp.md" }));

// 13. search empty result
log("13. search 'xyzzy-zonk-no-match'", await callTool("search_docs", { query: "xyzzy-zonk-no-match" }));

await client.close();
console.log("\n✅ Smoke test complete.");
