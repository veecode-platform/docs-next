import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: true,
  banner: { js: "#!/usr/bin/env node" },
  // server.js is created by T17; mark external so esbuild doesn't fail to resolve it now
  external: ["./server.js"],
});
