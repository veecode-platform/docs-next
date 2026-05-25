import { describe, it, expect } from "vitest";
import { chunkMarkdown } from "../lib/chunker.js";

describe("chunkMarkdown", () => {
  it("splits a doc at H2 boundaries", async () => {
    const md = `Lede paragraph.\n\n## First\nA\n\n## Second\nB\n`;
    const { lede, sections, outline } = await chunkMarkdown(md);
    expect(lede.content.trim()).toBe("Lede paragraph.");
    expect(sections).toHaveLength(2);
    expect(sections[0].title).toBe("First");
    expect(sections[0].anchor).toBe("first");
    expect(sections[1].title).toBe("Second");
    expect(outline.map((o) => o.title)).toEqual(["First", "Second"]);
  });

  it("absorbs H3/H4 into the parent H2 section and surfaces them in outline", async () => {
    const md = `## Parent\nIntro.\n\n### Sub\nDetail.\n\n#### Deeper\nx\n`;
    const { sections, outline } = await chunkMarkdown(md);
    expect(sections).toHaveLength(1);
    expect(sections[0].content).toContain("### Sub");
    expect(sections[0].content).toContain("#### Deeper");
    expect(outline.map((o) => ({ depth: o.depth, title: o.title }))).toEqual([
      { depth: 2, title: "Parent" },
      { depth: 3, title: "Sub" },
      { depth: 4, title: "Deeper" },
    ]);
  });

  it("preserves fenced code blocks (including mermaid and yaml)", async () => {
    const md = `## Config\n\n\`\`\`yaml\nkey: value\n\`\`\`\n\n\`\`\`mermaid\ngraph TD\nA-->B\n\`\`\`\n`;
    const { sections } = await chunkMarkdown(md);
    expect(sections[0].content).toContain("```yaml\nkey: value\n```");
    expect(sections[0].content).toContain("```mermaid\ngraph TD\nA-->B\n```");
  });

  it("preserves Docusaurus admonitions", async () => {
    const md = `## Notes\n\n:::warning\nbe careful\n:::\n`;
    const { sections } = await chunkMarkdown(md);
    expect(sections[0].content).toContain(":::warning");
    expect(sections[0].content).toContain(":::");
  });

  it("deduplicates anchors when section titles collide", async () => {
    const md = `## Setup\nA\n\n## Setup\nB\n`;
    const { sections } = await chunkMarkdown(md);
    expect(sections.map((s) => s.anchor)).toEqual(["setup", "setup-1"]);
  });

  it("returns empty sections and only-lede outcome for a doc with no H2", async () => {
    const md = `# Title\n\nbody only\n`;
    const { lede, sections, outline } = await chunkMarkdown(md);
    expect(sections).toHaveLength(0);
    expect(outline).toHaveLength(0);
    expect(lede.content).toContain("body only");
  });

  it("computes a token estimate per section", async () => {
    const md = `## A\n${"word ".repeat(100)}`;
    const { sections } = await chunkMarkdown(md);
    expect(sections[0].tokens).toBeGreaterThan(50);
    expect(sections[0].tokens).toBeLessThan(200);
  });
});
