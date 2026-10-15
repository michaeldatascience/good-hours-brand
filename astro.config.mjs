// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { parse } from 'yaml';
import { unified } from '@astrojs/markdown-remark';
import { rehypeTbd } from './src/lib/rehype-tbd.mjs';

const settings = parse(fs.readFileSync(new URL('./src/content/settings.yaml', import.meta.url), 'utf8'));
const domain = String(settings.domain ?? '').replace(/^TBD:\s*/i, '').trim();

export default defineConfig({
  site: `https://${domain}`,
  output: 'static',
  trailingSlash: 'always',
  server: {
    port: 4321,
    host: true,
  },
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeTbd],
      smartypants: false,
      gfm: true,
    }),
  },
});
