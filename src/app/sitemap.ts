import { MetadataRoute } from 'next';
import { siteConfig } from '../config/seo';
import { getPublishedContent } from '../lib/published-content';
import { publishedProjects } from '../lib/cms-projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    {
      url: siteConfig.productionOrigin,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // One entry per project that has its own page, read from the live content
  const projects: MetadataRoute.Sitemap = publishedProjects(await getPublishedContent()).map((project) => ({
    url: `${siteConfig.productionOrigin}/case-study/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...home, ...projects];
}
