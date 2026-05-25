import { describe, it, expect } from "vitest";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { walkProduct } from "../lib/doc-walker.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "__fixtures__");

describe("walkProduct", () => {
  it("returns one doc per .md file with relative path keyed to product id", async () => {
    const docs = await walkProduct({
      productId: "sample-product",
      productRoot: join(root, "sample-product"),
    });
    expect(docs.map((d) => d.path).sort()).toEqual([
      "sample-product/guides/long-doc.md",
      "sample-product/intro.md",
    ]);
  });

  it("parses frontmatter and uses `title` for doc title", async () => {
    const docs = await walkProduct({
      productId: "sample-product",
      productRoot: join(root, "sample-product"),
    });
    const intro = docs.find((d) => d.path.endsWith("intro.md"));
    expect(intro.title).toBe("Sample Intro");
    expect(intro.sidebarLabel).toBe("Intro");
    expect(intro.frontmatter.sidebar_position).toBe(1);
  });

  it("populates outline and sections via the chunker", async () => {
    const docs = await walkProduct({
      productId: "sample-product",
      productRoot: join(root, "sample-product"),
    });
    const long = docs.find((d) => d.path.endsWith("long-doc.md"));
    expect(long.sections.map((s) => s.title)).toEqual(["A", "B"]);
    expect(long.outline.map((o) => `${o.depth}:${o.title}`)).toEqual([
      "2:A",
      "3:A.1",
      "2:B",
    ]);
  });

  it("ignores non-markdown and underscore-prefixed files", async () => {
    const docs = await walkProduct({
      productId: "sample-product",
      productRoot: join(root, "sample-product"),
    });
    expect(docs.every((d) => d.path.endsWith(".md"))).toBe(true);
  });
});
