// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { parse } from 'yaml';
import { unified } from '@astrojs/markdown-remark';
import { rehypeTbd } from './src/lib/rehype-tbd.mjs';

const settings = parse(fs.readFileSync(new URL('./src/content/settings.yaml', import.meta.url), 'utf8'));
const domain = String(settings.domain ?? '').replace(/^TBD:\s*/i, '').trim();
const adminHtml = new URL('./public/admin/index.html', import.meta.url);

/** Dev and preview do not map /admin/ to public/admin/index.html. */
function adminDirectoryIndex() {
  const serve = (req, res, next) => {
    const path = req.url?.split('?')[0] ?? '';
    if (path === '/admin') {
      res.statusCode = 308;
      res.setHeader('Location', '/admin/');
      res.end();
      return;
    }
    if (path === '/admin/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(fs.readFileSync(adminHtml));
      return;
    }
    next();
  };
  return {
    name: 'admin-directory-index',
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
  };
}

export default defineConfig({
  site: `https://${domain}`,
  output: 'static',
  trailingSlash: 'always',
  server: {
    port: 4321,
    host: true,
  },
  integrations: [sitemap()],
  vite: {
    plugins: [adminDirectoryIndex()],
  },
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeTbd],
      smartypants: false,
      gfm: true,
    }),
  },
});
