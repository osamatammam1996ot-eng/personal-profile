import { MetadataRoute } from 'next';
import { siteConfig } from '../config/seo';

export default function robots(): MetadataRoute.Robots {
  // Prevent indexing on Vercel preview deployments
  if (process.env.VERCEL_ENV !== 'production' && process.env.VERCEL_ENV !== undefined) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/api/', '/_not-found'],
    },
    sitemap: `${siteConfig.productionOrigin}/sitemap.xml`,
  };
}
