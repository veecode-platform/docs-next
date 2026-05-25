import { unified } from "unified";
import remarkParse from "remark-parse";
import { toMarkdown } from "mdast-util-to-markdown";
import GithubSlugger from "github-slugger";

const parser = unified().use(remarkParse);

function nodeToMarkdown(node) {
  return toMarkdown(node, {
    bullet: "-",
    fences: true,
    incrementListMarker: false,
  });
}

function estimateTokens(text) {
  // Cheap heuristic: ~4 chars per token, used only for budgeting hints.
  return Math.ceil(text.length / 4);
}

function flattenHeadingText(headingNode) {
  return (headingNode.children ?? [])
    .map((child) => {
      if (child.type === "text" || child.type === "inlineCode") return child.value;
      if (child.children) return flattenHeadingText(child);
      return "";
    })
    .join("")
    .trim();
}

/**
 * Splits markdown into a lede (content before first H2), an array of H2-rooted
 * sections, and a flat outline (all headings from H2 onward).
 *
 * @param {string} markdown raw markdown body (no frontmatter)
 * @returns {Promise<{lede: {content: string, tokens: number}, sections: Array, outline: Array}>}
 */
async function chunkMarkdown(markdown) {
  const ast = parser.parse(markdown);
  const slugger = new GithubSlugger();

  const ledeChildren = [];
  const sections = [];
  const outline = [];
  let current = null;

  for (const node of ast.children) {
    if (node.type === "heading" && node.depth === 2) {
      if (current) {
        const content = nodeToMarkdown({ type: "root", children: current.children }).trim();
        sections.push({
          anchor: current.anchor,
          title: current.title,
          depth: 2,
          content,
          tokens: estimateTokens(content),
        });
      }
      const title = flattenHeadingText(node);
      const anchor = slugger.slug(title);
      outline.push({ depth: 2, title, anchor });
      current = { title, anchor, children: [node] };
      continue;
    }

    if (current) {
      current.children.push(node);
      if (node.type === "heading" && node.depth >= 3) {
        const title = flattenHeadingText(node);
        const anchor = slugger.slug(title);
        outline.push({ depth: node.depth, title, anchor });
      }
    } else {
      ledeChildren.push(node);
    }
  }

  if (current) {
    const content = nodeToMarkdown({ type: "root", children: current.children }).trim();
    sections.push({
      anchor: current.anchor,
      title: current.title,
      depth: 2,
      content,
      tokens: estimateTokens(content),
    });
  }

  const ledeContent = nodeToMarkdown({ type: "root", children: ledeChildren }).trim();
  return {
    lede: { content: ledeContent, tokens: estimateTokens(ledeContent) },
    sections,
    outline,
  };
}

export { chunkMarkdown };
