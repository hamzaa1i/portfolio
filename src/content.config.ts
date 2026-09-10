import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Projects — the single source of truth for all flagship work.
 * Powers homepage cards, the work index, case-study routes, SEO
 * metadata and related-project logic. No project data may be
 * hardcoded in any page.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      /** Full public title, e.g. "Reve Stitching Digital Platform". */
      title: z.string(),
      /** Compact card label, e.g. "Reve Platform". */
      shortTitle: z.string(),
      /** One-line descriptor used on cards and the work index. */
      subtitle: z.string(),
      /** Outcome category, e.g. "Digital Platform", "Ecommerce". */
      category: z.string(),
      /** Honest time framing. Omit when dates are unverified. */
      timeline: z.string().optional(),
      status: z.enum(['live', 'ongoing', 'internal']),
      featured: z.boolean(),
      /** Homepage ordering. Reve Platform is always 1. */
      featuredOrder: z.number().int().min(1).max(4),
      /** Portfolio-facing role wording. */
      role: z.string(),
      /** Public client label. */
      clientPublic: z.string(),
      privacy: z.enum(['public', 'private']),
      /** One or two sentences summarising the project for cards/SEO. */
      summary: z.string(),
      /** Maximum 6 meaningful technologies. */
      stack: z.array(z.string()).max(6),
      /** Card thumbnail image (relative to the entry file). */
      thumbnail: image().optional(),
      /** Case-study hero image (relative to the entry file). */
      hero: image().optional(),
      liveUrl: z.url().optional(),
      sourceUrl: z.url().optional(),
      /** Only explicitly verified metrics. Rendered by the stat element. */
      results: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .default([]),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

/**
 * Notes — secondary editorial section. Renamed from V1 "Writing".
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
