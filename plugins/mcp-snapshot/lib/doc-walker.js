const { promises: fs } = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

async function listMarkdown(dir, acc = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return acc;
    throw err;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await listMarkdown(full, acc);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      acc.push(full);
    }
  }
  return acc;
}

function extractH1Title(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Walks a product directory and returns an array of doc records ready for the snapshot.
 * @param {{ productId: string, productRoot: string }} args
 */
async function walkProduct({ productId, productRoot }) {
  const { chunkMarkdown } = await import("./chunker.js");

  const files = await listMarkdown(productRoot);
  const docs = [];
  for (const absPath of files) {
    const raw = await fs.readFile(absPath, "utf8");
    const { data: frontmatter, content } = matter(raw);
    const { lede, sections, outline } = await chunkMarkdown(content);
    if (lede.content) {
      sections.unshift({
        anchor: "",
        title: "",
        depth: 2,
        content: lede.content,
        tokens: lede.tokens,
      });
    }
    const title =
      (typeof frontmatter.title === "string" && frontmatter.title) ||
      extractH1Title(content) ||
      path.basename(absPath, ".md");
    const sidebarLabel =
      typeof frontmatter.sidebar_label === "string" ? frontmatter.sidebar_label : undefined;
    const relFromProduct = path.relative(productRoot, absPath).split(path.sep).join("/");
    docs.push({
      path: `${productId}/${relFromProduct}`,
      product: productId,
      title,
      sidebarLabel,
      frontmatter,
      outline,
      sections,
    });
  }
  return docs;
}

module.exports = { walkProduct };
