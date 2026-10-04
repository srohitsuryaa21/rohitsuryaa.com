// Structured data for search engines (schema.org JSON-LD): who the site is about, and what each page is.
import { site, type Lang } from '../i18n/content';

export const origin = 'https://rohitsuryaa.com';
const personId = `${origin}/#person`;
const siteId = `${origin}/#website`;

export const person = (lang: Lang) => ({
  '@type': 'Person',
  '@id': personId,
  name: 'Rohit Suryaa Saravanan',
  alternateName: 'Rohit Suryaa',
  url: `${origin}/`,
  image: `${origin}/images/rohit.jpg`,
  jobTitle: lang === 'de' ? 'Softwareentwickler und Data Scientist' : 'Software Developer and Data Scientist',
  address: { '@type': 'PostalAddress', addressLocality: 'Fulda', addressCountry: 'DE' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Hochschule Fulda' },
  knowsAbout: ['Data science', 'Machine learning', 'Time series forecasting', 'Data engineering', 'Backend development', 'C#', '.NET', 'Python', 'AI agents', 'LangGraph'],
  sameAs: [site.linkedin, site.github],
});

export const website = (lang: Lang) => ({
  '@type': 'WebSite',
  '@id': siteId,
  url: `${origin}/`,
  name: 'Rohit Suryaa',
  alternateName: 'rohitsuryaa.com',
  inLanguage: ['en', 'de'],
  publisher: { '@id': personId },
  description: lang === 'de' ? 'Portfolio von Rohit Suryaa Saravanan' : 'Portfolio of Rohit Suryaa Saravanan',
});

export const profilePage = (url: string, name: string, description: string, lang: Lang) => ({
  '@type': 'ProfilePage', '@id': `${url}#page`, url, name, description, inLanguage: lang,
  isPartOf: { '@id': siteId }, mainEntity: { '@id': personId },
});

export const caseStudy = (o: { url: string; name: string; headline: string; description: string; image: string; lang: Lang; keywords: string[]; code?: string }) => ({
  '@type': 'Article', '@id': `${o.url}#article`, url: o.url, mainEntityOfPage: o.url, headline: o.headline, name: o.name,
  description: o.description, image: o.image, inLanguage: o.lang, keywords: o.keywords.join(', '),
  author: { '@id': personId }, publisher: { '@id': personId }, isPartOf: { '@id': siteId },
  ...(o.code ? { citation: o.code } : {}),
});

export const breadcrumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});
