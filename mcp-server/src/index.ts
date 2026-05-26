async function main(): Promise<void> {
  const { startServer } = await import("./server.js");
  await startServer();
}

main().catch((err) => {
  process.stderr.write(`[veecode-docs-mcp] fatal: ${err?.message ?? err}\n`);
  process.exit(1);
});
