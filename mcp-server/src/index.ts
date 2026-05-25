async function main(): Promise<void> {
  // @ts-expect-error – server.ts is created in T17; dynamic import is unresolvable until then
  const { startServer } = await import("./server.js");
  await startServer();
}

main().catch((err) => {
  process.stderr.write(`[veecode-docs-mcp] fatal: ${err?.message ?? err}\n`);
  process.exit(1);
});
