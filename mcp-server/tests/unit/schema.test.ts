import { describe, it, expect } from "vitest";
import { SnapshotSchema, type Snapshot } from "../../src/schema.js";

describe("SnapshotSchema", () => {
  const valid: Snapshot = {
    version: "2026.05.25-abc1234",
    generatedAt: "2026-05-25T14:30:00Z",
    products: [
      { id: "devportal", name: "DevPortal", description: "x", docCount: 1 },
      { id: "platform", name: "Platform", description: "x", docCount: 0 },
      { id: "admin-ui", name: "Admin-UI", description: "x", docCount: 0 },
      { id: "vkdr", name: "VKDR-CLI", description: "x", docCount: 0 },
    ],
    docs: [
      {
        path: "devportal/intro.md",
        product: "devportal",
        title: "Intro",
        sidebarLabel: "Intro",
        frontmatter: {},
        outline: [{ depth: 2, title: "First", anchor: "first" }],
        sections: [
          {
            anchor: "first",
            title: "First",
            depth: 2,
            content: "Hello",
            tokens: 1,
          },
        ],
      },
    ],
  };

  it("accepts a valid snapshot", () => {
    expect(() => SnapshotSchema.parse(valid)).not.toThrow();
  });

  it("rejects a snapshot with a wrong product id", () => {
    const bad = { ...valid, docs: [{ ...valid.docs[0], product: "unknown" }] };
    expect(() => SnapshotSchema.parse(bad)).toThrow();
  });

  it("rejects a doc whose section anchor is missing from outline", () => {
    const bad = {
      ...valid,
      docs: [
        {
          ...valid.docs[0],
          sections: [{ ...valid.docs[0].sections[0], anchor: "orphan" }],
        },
      ],
    };
    expect(() => SnapshotSchema.parse(bad)).toThrow(/outline/i);
  });
});
