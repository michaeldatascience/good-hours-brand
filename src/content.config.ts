import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import fs from 'node:fs';
import path from 'node:path';

const status = z.enum(['active', 'coming-soon', 'hidden']);
const category = z.enum(['red-light', 'massage', 'sleep']);
const need = z.enum(['after-training', 'long-day', 'before-bed', 'travel']);
const icon = z.enum([
  'truck',
  'rotate-ccw',
  'shield-check',
  'sun',
  'thermometer',
  'waves',
  'moon',
  'clock',
  'luggage',
  'arrow-right',
]);

function optionalImage({ image }: SchemaContext, ups: 1 | 2) {
  const prefix = `${'../'.repeat(ups)}assets/images/`;
  return z.preprocess((val) => {
    if (typeof val !== 'string') return undefined;
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    const file = trimmed.split('?')[0]?.split('/').filter(Boolean).pop();
    if (!file || !/\.(png|jpe?g|webp|gif|avif)$/i.test(file)) return undefined;
    const abs = path.join(process.cwd(), 'src/assets/images', file);
    if (!fs.existsSync(abs)) return undefined;
    return `${prefix}${file}`;
  }, image().optional());
}

const shot = (ctx: SchemaContext, ups: 1 | 2) =>
  z.object({
    image: optionalImage(ctx, ups),
    alt: z.string().min(1),
    shot: z.string().min(1),
  });

const qa = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const titled = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: './src/content' }),
  schema: z.object({
    brandName: z.string().min(1),
    legalName: z.string().min(1),
    domain: z.string().min(1),
    draft: z.boolean(),
    supportEmail: z.string().min(1),
    responseTime: z.string().min(1),
    announcement: z.string(),
    trustStrip: z
      .array(
        z.object({
          icon,
          title: z.string().min(1),
          text: z.string().min(1),
        }),
      )
      .min(1),
    wellnessDisclaimer: z.string().min(1),
    seoTitle: z.string().min(1),
    seoDescription: z.string().min(1),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content' }),
  schema: (ctx) =>
    z.object({
      hero: z.object({
        eyebrow: z.string().min(1),
        heading: z.string().min(1),
        subheading: z.string().min(1),
        buttonLabel: z.string().min(1),
        buttonLink: z.string().min(1),
        image: shot(ctx, 1),
      }),
      products: z.object({
        heading: z.string().min(1),
        intro: z.string().min(1),
      }),
      routines: z.object({
        heading: z.string().min(1),
        items: z
          .array(
            z.object({
              need,
              title: z.string().min(1),
              minutes: z.number().positive(),
              steps: z.array(z.string().min(1)).min(1),
              product: z.string().min(1),
            }),
          )
          .min(1),
      }),
      howItWorks: z.object({
        heading: z.string().min(1),
        items: z
          .array(
            z.object({
              icon,
              title: z.string().min(1),
              text: z.string().min(1),
            }),
          )
          .min(1),
      }),
      compare: z.object({
        heading: z.string().min(1),
        intro: z.string().min(1),
      }),
      bundles: z.object({
        heading: z.string().min(1),
        intro: z.string().min(1),
      }),
      faq: z.object({
        heading: z.string().min(1),
        questions: z.array(z.string().min(1)).min(1),
      }),
      closing: z.object({
        heading: z.string().min(1),
        text: z.string().min(1),
        buttonLabel: z.string().min(1),
        buttonLink: z.string().min(1),
      }),
    }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/products' }),
  schema: (ctx) =>
    z.object({
      name: z.string().min(1),
      status,
      category,
      needs: z.array(need).min(1),
      order: z.number(),
      tagline: z.string().min(1).max(80),
      summary: z.string().min(1).max(240),
      price: z.number().positive().optional(),
      buyUrl: z.string().optional(),
      variants: z
        .array(
          z.object({
            name: z.string().min(1),
            swatch: z.string().min(1),
            available: z.boolean(),
          }),
        )
        .min(1),
      images: z.array(shot(ctx, 2)).min(1),
      specChips: z.array(z.string().min(1)).min(3).max(4),
      benefits: z.array(titled).min(3).max(5),
      inTheBox: z.array(z.string().min(1)).min(1),
      howToUse: z.array(titled).length(3),
      specs: z
        .array(
          z.object({
            group: z.string().min(1),
            label: z.string().min(1),
            value: z.string().min(1),
          }),
        )
        .min(1),
      faq: z.array(qa).min(3),
      precautions: z.array(z.string().min(1)).min(3),
      bundle: z.string().optional(),
      related: z.array(z.string()).default([]),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const bundles = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/bundles' }),
  schema: (ctx) =>
    z.object({
      name: z.string().min(1),
      status,
      order: z.number(),
      tagline: z.string().min(1).max(80),
      summary: z.string().min(1).max(240),
      items: z.array(z.string().min(1)).min(2),
      price: z.number().positive(),
      buyUrl: z.string().optional(),
      images: z.array(shot(ctx, 2)).min(1),
      whyTogether: z.array(titled).min(2),
      faq: z.array(qa).min(1),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const accessories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/accessories' }),
  schema: (ctx) =>
    z.object({
      name: z.string().min(1),
      status,
      order: z.number(),
      fits: z.array(z.string().min(1)).min(1),
      summary: z.string().min(1).max(240),
      price: z.number().positive(),
      buyUrl: z.string().optional(),
      image: optionalImage(ctx, 2),
      alt: z.string().min(1),
      shot: z.string().min(1),
    }),
});

const pageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: pageSchema,
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/policies' }),
  schema: pageSchema,
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: (ctx) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      image: optionalImage(ctx, 2),
      alt: z.string().min(1),
      shot: z.string().min(1),
    }),
});

const faqs = defineCollection({
  loader: glob({ pattern: 'faqs.yaml', base: './src/content' }),
  schema: z.object({
    manuals: z.string().min(1),
    warrantyNote: z.string().min(1),
    groups: z
      .array(
        z.object({
          title: z.string().min(1),
          items: z.array(qa).min(1),
        }),
      )
      .min(1),
  }),
});

const compare = defineCollection({
  loader: glob({ pattern: 'compare.yaml', base: './src/content' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    intro: z.string().min(1),
    footnote: z.string().min(1),
    tables: z
      .array(
        z.object({
          product: z.string().min(1),
          rows: z
            .array(
              z.object({
                label: z.string().min(1),
                ours: z.string().min(1),
                premium: z.string().min(1),
                budget: z.string().min(1),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

export const collections = {
  settings,
  home,
  products,
  bundles,
  accessories,
  pages,
  policies,
  journal,
  faqs,
  compare,
};
