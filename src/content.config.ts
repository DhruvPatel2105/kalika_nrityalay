import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    // WhatsApp truncates link previews aggressively — brief section 9.
    ogTitle: z.string().max(60).optional(),
    ogDescription: z.string().max(110).optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Kalika Nrityalay"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
