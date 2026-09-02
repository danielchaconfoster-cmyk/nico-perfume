import { MetadataRoute } from 'next';
import { allPerfumes, getPerfumeSlug } from '@/lib/perfumes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nicoperfume.cl';
  const now = new Date();

  // Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalogo`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/fragancias-gemelas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sommelier-quiz`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/clima-olfativo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/decants`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/mayorista`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/checkout`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Rutas dinámicas de producto (SEO Indexable)
  const productRoutes: MetadataRoute.Sitemap = allPerfumes.map(perfume => ({
    url: `${siteUrl}/producto/${getPerfumeSlug(perfume)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: perfume.isBestSeller ? 0.9 : 0.75,
  }));

  return [...staticRoutes, ...productRoutes];
}
