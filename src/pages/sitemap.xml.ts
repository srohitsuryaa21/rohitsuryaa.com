// sitemap.xml: every page in both languages, each linked to its translation so search engines show the right one.
import { projects } from '../data/projects';
import { localePath, type Lang } from '../i18n/content';
import { origin } from '../data/seo';

const langs: Lang[] = ['en', 'de'];
const paths = ['/', ...projects.map((p) => `/work/${p.slug}/`)];

export function GET() {
  const urls = paths.flatMap((path) => langs.map((lang) => {
    const alt = langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${origin}${localePath(l, path)}"/>`).join('');
    return `<url><loc>${origin}${localePath(lang, path)}</loc>${alt}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}${path}"/><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`;
  }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
