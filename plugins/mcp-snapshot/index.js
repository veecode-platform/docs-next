/**
 * Docusaurus plugin that emits mcp-snapshot.json during build.
 * Wires the snapshot-builder against the site's docs plugins.
 */
module.exports = function mcpSnapshotPlugin(context, options) {
  return {
    name: "mcp-snapshot",
    async postBuild({ outDir }) {
      const { buildSnapshot } = require("./lib/snapshot-builder.js");
      await buildSnapshot({
        repoRoot: context.siteDir,
        outDir,
        options,
      });
    },
  };
};
