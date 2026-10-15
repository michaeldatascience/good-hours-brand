import type { APIRoute } from 'astro';
import { getSettings } from '../lib/catalog';
import { stripTbd } from '../lib/format';

export const GET: APIRoute = async () => {
  const settings = await getSettings();
  const domain = stripTbd(settings.domain);
  const body = settings.draft
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: https://${domain}/sitemap-index.xml\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
