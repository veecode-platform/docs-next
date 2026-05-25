import { z } from "zod";

export const PRODUCT_IDS = ["devportal", "platform", "admin-ui", "vkdr"] as const;
export const ProductIdSchema = z.enum(PRODUCT_IDS);
export type ProductId = z.infer<typeof ProductIdSchema>;

export const OutlineEntrySchema = z.object({
  depth: z.number().int().min(1).max(6),
  title: z.string().min(1),
  anchor: z.string(),
});

export const SectionSchema = z.object({
  anchor: z.string(),
  title: z.string(),
  depth: z.number().int().min(2).max(2),
  content: z.string(),
  tokens: z.number().int().nonnegative(),
});

export const DocSchema = z
  .object({
    path: z.string().min(1),
    product: ProductIdSchema,
    title: z.string(),
    sidebarLabel: z.string().optional(),
    frontmatter: z.record(z.unknown()),
    outline: z.array(OutlineEntrySchema),
    sections: z.array(SectionSchema),
  })
  .refine(
    (doc) => {
      const outlineAnchors = new Set(doc.outline.map((e) => e.anchor));
      return doc.sections.every(
        (s) => s.anchor === "" || outlineAnchors.has(s.anchor),
      );
    },
    { message: "section anchor must appear in outline (or be the empty lede)" },
  );

export const ProductSchema = z.object({
  id: ProductIdSchema,
  name: z.string(),
  description: z.string(),
  docCount: z.number().int().nonnegative(),
});

export const SnapshotSchema = z.object({
  version: z.string().regex(/^\d{4}\.\d{2}\.\d{2}-[a-f0-9]{7}$/),
  generatedAt: z.string().datetime(),
  products: z.array(ProductSchema).length(4),
  docs: z.array(DocSchema),
});

export type OutlineEntry = z.infer<typeof OutlineEntrySchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Doc = z.infer<typeof DocSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Snapshot = z.infer<typeof SnapshotSchema>;
