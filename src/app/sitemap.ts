import { MetadataRoute } from 'next';
import { siteConfig } from '../config/seo';
import { DEFAULT_CMS_DATA } from '../types/cms';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseSitemap: MetadataRoute.Sitemap = [
    {
      url: siteConfig.productionOrigin,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const caseStudySitemap: MetadataRoute.Sitemap = DEFAULT_CMS_DATA.caseStudies
    .filter((study: any) => study.visible !== false)
    .map((study: any) => ({
      url: `${siteConfig.productionOrigin}/case-study/${study.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  return [...baseSitemap, ...caseStudySitemap];
}
